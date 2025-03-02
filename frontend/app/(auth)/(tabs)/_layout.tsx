import { Icon } from "@/components/ui/icon";
import { Tabs } from "expo-router";
import { HouseIcon, SquarePenIcon, UserRoundIcon } from "lucide-react-native";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ animation: "shift", headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Icon as={HouseIcon} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="new"
        options={{
          title: "New",
          tabBarIcon: ({ color, size }) => (
            <Icon as={SquarePenIcon} color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="me"
        options={{
          title: "Me",
          tabBarIcon: ({ color, size }) => (
            <Icon as={UserRoundIcon} color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
