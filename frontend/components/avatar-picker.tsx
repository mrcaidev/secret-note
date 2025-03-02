import * as ImagePicker from "expo-image-picker";
import { ChevronRightIcon } from "lucide-react-native";
import { Alert, Pressable, View } from "react-native";
import { Avatar } from "./avatar";
import { Icon } from "./ui/icon";
import { Text } from "./ui/text";

type Props = {
  currentAvatarUrl: string;
};

export function AvatarPicker({ currentAvatarUrl }: Props) {
  const pickAvatar = async () => {
    const { assets, canceled } = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (canceled) {
      return;
    }

    if (!assets[0]) {
      Alert.alert("Error", "No image selected.", [{ text: "OK" }], {
        cancelable: true,
      });
      return;
    }

    const { uri } = assets[0];
    console.log(uri);
  };

  return (
    <Pressable
      onPress={pickAvatar}
      className="group flex flex-row justify-start items-center px-6 py-4 web:hover:bg-accent web:hover:text-accent-foreground active:bg-accent web:transition-colors"
    >
      <Text className="group-active:text-accent-foreground web:transition-colors">
        Avatar
      </Text>
      <View className="grow" />
      {currentAvatarUrl ? (
        <Avatar user={{ nickname: "X", avatarUrl: currentAvatarUrl }} />
      ) : (
        <Text className="text-muted-foreground group-active:text-accent-foreground text-sm web:transition-colors">
          None
        </Text>
      )}
      <Icon
        as={ChevronRightIcon}
        className="ml-2 text-muted-foreground group-active:text-accent-foreground web:transition-colors"
      />
    </Pressable>
  );
}
