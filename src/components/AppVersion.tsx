import { getAppVersion } from "@/utils/appVersion";
import { Text } from "react-native";

type Props = {
  style?: object;
}

export function AppVersion({style}: Props) {
  return (
    <Text style={style}>
      TradeFence v{getAppVersion()}
    </Text>
  )
}