import { useCreateNoteMutation } from "@/apis/note";
import { FormError } from "@/components/form-error";
import { FormFieldError } from "@/components/form-field-error";
import { Spinner } from "@/components/spinner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Text } from "@/components/ui/text";
import { cn } from "@/components/ui/utils";
import { valibotResolver } from "@hookform/resolvers/valibot";
import * as Clipboard from "expo-clipboard";
import { useRouter } from "expo-router";
import {
  ClipboardIcon,
  EraserIcon,
  PlusIcon,
  RefreshCwIcon,
  Share2Icon,
  XIcon,
} from "lucide-react-native";
import { Fragment, useEffect, useState } from "react";
import {
  Controller,
  FormProvider,
  useForm,
  useFormContext,
} from "react-hook-form";
import { Pressable, TextInput, View } from "react-native";
import * as v from "valibot";

const schema = v.pipe(
  v.object({
    title: v.pipe(
      v.string(),
      v.minLength(1, "Title is required"),
      v.maxLength(50, "Title should be less than 50 characters"),
    ),
    content: v.pipe(
      v.string(),
      v.minLength(1, "Content is required"),
      v.maxLength(10000, "Content should be less than 10000 characters"),
    ),
    passwordEnabled: v.boolean(),
    password: v.union([
      v.literal(""),
      v.pipe(
        v.string(),
        v.toUpperCase(),
        v.length(4, "Password should be exactly 4 characters"),
        v.regex(
          /^[A-Z0-9]+$/,
          "Password should contain only letters and digits",
        ),
      ),
    ]),
    burn: v.boolean(),
    ttlEnabled: v.boolean(),
    ttl: v.union([
      v.literal(0),
      v.pipe(
        v.number("Days should be an integer"),
        v.integer("Days should be an integer"),
        v.minValue(1, "Days should be between 1-365"),
        v.maxValue(365, "Days should be between 1-365"),
      ),
    ]),
    receiversEnabled: v.boolean(),
    receivers: v.array(v.pipe(v.string(), v.email("Invalid email"))),
  }),
  v.forward(
    v.check(
      ({ password, passwordEnabled }) => !passwordEnabled || password !== "",
      "Password is required",
    ),
    ["password"],
  ),
  v.forward(
    v.check(
      ({ ttl, ttlEnabled }) => !ttlEnabled || ttl > 0,
      "Days should be between 1-365",
    ),
    ["ttl"],
  ),
  v.forward(
    v.check(
      ({ receivers, receiversEnabled }) =>
        !receiversEnabled || receivers.length > 0,
      "Receivers are required",
    ),
    ["receivers"],
  ),
);

type Schema = v.InferOutput<typeof schema>;

export default function NewNotePage() {
  const form = useForm<Schema>({
    defaultValues: {
      title: "",
      content: "",
      passwordEnabled: false,
      password: "",
      burn: false,
      ttlEnabled: false,
      ttl: 0,
      receiversEnabled: false,
      receivers: [],
    },
    resolver: valibotResolver(schema),
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [formError, setFormError] = useState<Error | null>(null);

  return (
    <FormProvider {...form}>
      <View className="grow px-6 pt-16 bg-background">
        <ContentTextarea />
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <View className="gap-2 my-4">
            <CopyFromClipboardButton />
            <ClearButton />
            <DialogOpener />
          </View>
          <DialogContent className="min-w-80">
            <DialogHeader>
              <DialogTitle>Settings</DialogTitle>
              <DialogDescription>
                Customize and secure your note
              </DialogDescription>
            </DialogHeader>
            <View className="gap-4">
              <TitleInput />
              <PasswordInput />
              <BurnCheckbox />
              <TtlInput />
              <ReceiversInput />
            </View>
            <DialogFooter>
              <View className="flex-row justify-end gap-2 mt-2">
                <DialogClose asChild>
                  <Button variant="secondary">
                    <Icon as={XIcon} />
                    <Text>Cancel</Text>
                  </Button>
                </DialogClose>
                <CreateNoteButton
                  closeDialog={() => setDialogOpen(false)}
                  setFormError={setFormError}
                />
              </View>
              <FormError error={formError} />
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </View>
    </FormProvider>
  );
}

function ContentTextarea() {
  const { control } = useFormContext<Schema>();

  return (
    <Controller
      control={control}
      name="content"
      render={({ field, fieldState }) => (
        <View className="grow gap-2">
          <TextInput
            {...field}
            onChangeText={field.onChange}
            placeholder="Paste and share!"
            multiline
            textAlignVertical="top"
            aria-label="content"
            className="grow web:focus-visible:outline-none text-foreground text-base font-sans placeholder:text-muted-foreground"
          />
          <FormFieldError error={fieldState.error} />
        </View>
      )}
    />
  );
}

function DialogOpener() {
  const { watch } = useFormContext<Schema>();
  const content = watch("content");

  return (
    <DialogTrigger asChild>
      <Button disabled={content === ""}>
        <Icon as={Share2Icon} />
        <Text>Share</Text>
      </Button>
    </DialogTrigger>
  );
}

function CopyFromClipboardButton() {
  const { watch, setValue } = useFormContext<Schema>();
  const content = watch("content");

  const copyFromClipboard = async () => {
    const content = await Clipboard.getStringAsync();
    setValue("content", content);
  };

  if (content) {
    return null;
  }

  return (
    <Button variant="secondary" onPress={copyFromClipboard}>
      <Icon as={ClipboardIcon} />
      <Text>Copy from Clipboard</Text>
    </Button>
  );
}

function ClearButton() {
  const { watch, resetField } = useFormContext<Schema>();
  const content = watch("content");

  const clearContent = () => {
    resetField("content");
  };

  if (!content) {
    return null;
  }

  return (
    <Button variant="secondary" onPress={clearContent}>
      <Icon as={EraserIcon} />
      <Text>Clear</Text>
    </Button>
  );
}

function generateTitle(content: string) {
  return content.split("\n")[0]!.slice(0, 20).trim();
}

function TitleInput() {
  const { control, getFieldState, getValues, setValue } =
    useFormContext<Schema>();

  useEffect(() => {
    if (getFieldState("title").isDirty) {
      return;
    }

    const content = getValues("content");
    setValue("title", generateTitle(content), { shouldValidate: true });
  }, [getFieldState, getValues, setValue]);

  return (
    <Controller
      control={control}
      name="title"
      render={({ field, fieldState }) => (
        <View className="gap-2">
          <Label nativeID="title">Title</Label>
          <Input
            {...field}
            onChangeText={field.onChange}
            maxLength={50}
            placeholder="1-50 characters"
            aria-labelledby="title"
          />
          <FormFieldError error={fieldState.error} />
        </View>
      )}
    />
  );
}

function generatePassword() {
  return Math.random().toString(36).slice(2, 6).toUpperCase();
}

function PasswordInput() {
  const { control, formState, watch, getFieldState, setValue } =
    useFormContext<Schema>();
  const passwordEnabled = watch("passwordEnabled");

  useEffect(() => {
    if (!passwordEnabled || getFieldState("password").isDirty) {
      return;
    }

    setValue("password", generatePassword(), {
      shouldValidate: true,
      shouldDirty: true,
    });
  }, [passwordEnabled, getFieldState, setValue]);

  return (
    <View className="gap-2">
      <View className="flex-row items-center gap-3">
        <Controller
          control={control}
          name="passwordEnabled"
          render={({ field }) => (
            <Fragment>
              <Switch
                {...field}
                checked={field.value}
                onCheckedChange={field.onChange}
                aria-labelledby="passwordEnabled"
              />
              <Label
                nativeID="passwordEnabled"
                onPress={() => {
                  field.onChange(!field.value);
                }}
                className={cn(field.value || "text-muted-foreground")}
              >
                Password
              </Label>
            </Fragment>
          )}
        />
        <Controller
          control={control}
          name="password"
          render={({ field }) => (
            <View className="flex-row items-center gap-1">
              <Input
                {...field}
                onChangeText={field.onChange}
                maxLength={4}
                editable={passwordEnabled}
                className="w-20 web:w-20 uppercase"
              />
              <Button
                variant="ghost"
                size="icon"
                onPress={() => {
                  field.onChange(generatePassword());
                }}
                disabled={!passwordEnabled}
                aria-label="Regenerate a random password"
              >
                <Icon as={RefreshCwIcon} />
              </Button>
            </View>
          )}
        />
      </View>
      <FormFieldError error={formState.errors.password} />
    </View>
  );
}

function BurnCheckbox() {
  const { control } = useFormContext<Schema>();

  return (
    <Controller
      control={control}
      name="burn"
      render={({ field, fieldState }) => (
        <View className="gap-2">
          <View className="flex-row items-center gap-3">
            <Switch
              {...field}
              checked={field.value}
              onCheckedChange={field.onChange}
              aria-labelledby="burn"
            />
            <Label
              nativeID="burn"
              onPress={() => {
                field.onChange(!field.value);
              }}
              className={cn(field.value || "text-muted-foreground")}
            >
              Burn after read
            </Label>
          </View>
          <FormFieldError error={fieldState.error} />
        </View>
      )}
    />
  );
}

function TtlInput() {
  const { control, formState, watch } = useFormContext<Schema>();
  const ttlEnabled = watch("ttlEnabled");

  return (
    <View className="gap-2">
      <View className="flex-row items-center gap-3">
        <Controller
          control={control}
          name="ttlEnabled"
          render={({ field }) => (
            <Fragment>
              <Switch
                {...field}
                checked={field.value}
                onCheckedChange={field.onChange}
                aria-labelledby="ttlEnabled"
              />
              <Label
                nativeID="ttlEnabled"
                onPress={() => {
                  field.onChange(!field.value);
                }}
                className={cn(field.value || "text-muted-foreground")}
              >
                Expires in
              </Label>
            </Fragment>
          )}
        />
        <Controller
          control={control}
          name="ttl"
          render={({ field }) => (
            <Input
              {...field}
              value={field.value === 0 ? "" : String(field.value)}
              onChangeText={(text) => {
                field.onChange(Number(text));
              }}
              editable={ttlEnabled}
              keyboardType="numeric"
              className="w-16 web:w-16"
            />
          )}
        />
        <Label className={cn(ttlEnabled || "text-muted-foreground")}>
          days
        </Label>
      </View>
      <FormFieldError error={formState.errors.ttl} />
    </View>
  );
}

function ReceiversInput() {
  const { control, formState, watch } = useFormContext<Schema>();
  const receiversEnabled = watch("receiversEnabled");

  return (
    <View className="gap-2">
      <Controller
        control={control}
        name="receiversEnabled"
        render={({ field }) => (
          <View className="flex-row items-center gap-3">
            <Switch
              {...field}
              checked={field.value}
              onCheckedChange={field.onChange}
              aria-labelledby="receiversEnabled"
            />
            <Label
              nativeID="receiversEnabled"
              onPress={() => {
                field.onChange(!field.value);
              }}
              className={cn(field.value || "text-muted-foreground")}
            >
              Specify receivers...
            </Label>
          </View>
        )}
      />
      <FormFieldError
        error={(() => {
          const error = formState.errors.receivers;
          return Array.isArray(error) ? error[0] : error;
        })()}
      />
      {receiversEnabled && (
        <Controller
          control={control}
          name="receivers"
          render={({ field }) => (
            <Fragment>
              <View className="flex-row items-center gap-1 flex-wrap">
                {field.value.map((email) => (
                  <Receiver key={email} email={email} />
                ))}
              </View>
              <ReceiverInput />
            </Fragment>
          )}
        />
      )}
    </View>
  );
}

type ReceiverProps = {
  email: string;
};

function Receiver({ email }: ReceiverProps) {
  const { getValues, setValue } = useFormContext<Schema>();

  const removeReceiver = () => {
    setValue(
      "receivers",
      getValues("receivers").filter((r) => r !== email),
      { shouldValidate: true },
    );
  };

  return (
    <View className="flex-row items-center gap-1.5 px-2.5 py-1 rounded-md bg-card">
      <Text className="text-card-foreground text-sm">{email}</Text>
      <Pressable onPress={removeReceiver} aria-label="remove receiver">
        <Icon as={XIcon} className="text-card-foreground" />
      </Pressable>
    </View>
  );
}

const emailSchema = v.object({
  email: v.pipe(v.string(), v.email("Invalid email")),
});

type EmailSchema = v.InferOutput<typeof emailSchema>;

function ReceiverInput() {
  const { control, handleSubmit, formState, reset } = useForm<EmailSchema>({
    defaultValues: {
      email: "",
    },
    resolver: valibotResolver(emailSchema),
  });

  const { getValues, setValue } = useFormContext<Schema>();

  const addReceiver = handleSubmit(({ email }) => {
    setValue("receivers", [...getValues("receivers"), email], {
      shouldValidate: true,
    });
    reset();
  });

  return (
    <View className="gap-2">
      <View className="flex-row items-center gap-2">
        <Controller
          control={control}
          name="email"
          render={({ field }) => (
            <Input
              {...field}
              onChangeText={field.onChange}
              placeholder="someone@example.com"
              keyboardType="email-address"
              aria-label="new receiver email"
            />
          )}
        />
        <Button
          variant="ghost"
          size="icon"
          onPress={addReceiver}
          aria-label="add receiver"
        >
          <Icon as={PlusIcon} />
        </Button>
      </View>
      <FormFieldError error={formState.errors.email} />
    </View>
  );
}

type CreateNoteButtonProps = {
  closeDialog: () => void;
  setFormError: (error: Error | null) => void;
};

function CreateNoteButton({
  closeDialog,
  setFormError,
}: CreateNoteButtonProps) {
  const { handleSubmit, formState, reset } = useFormContext<Schema>();

  const { mutate, isPending } = useCreateNoteMutation();

  const router = useRouter();

  const createNote = handleSubmit(
    ({
      password,
      passwordEnabled,
      receivers,
      receiversEnabled,
      ttl,
      ttlEnabled,
      ...rest
    }) => {
      const data = {
        ...rest,
        password: passwordEnabled ? password : "",
        receivers: receiversEnabled ? receivers : [],
        ttl: ttlEnabled ? ttl : 0,
      };

      mutate(data, {
        onSuccess: (note) => {
          reset();
          setFormError(null);
          closeDialog();
          router.push(`/notes/${note.id}`);
        },
        onError: setFormError,
      });
    },
  );

  return (
    <Button disabled={!formState.isValid || isPending} onPress={createNote}>
      {isPending ? <Spinner /> : <Icon as={Share2Icon} />}
      <Text>Share</Text>
    </Button>
  );
}
