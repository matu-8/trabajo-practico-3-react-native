import { NativeTabs } from 'expo-router/unstable-native-tabs';

import { Cristal, Paleta } from '@/constants/theme';

export default function TabsLayout() {
  return (
    <NativeTabs
      backgroundColor={Paleta.profundo}
      indicatorColor={Cristal.acento}
      tintColor={Cristal.acentoClaro}
      labelStyle={{
        default: { color: Cristal.textoSecundario },
        selected: { color: Cristal.acentoClaro },
      }}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Reportes</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="wrench.and.screwdriver.fill" md="build" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="avisos">
        <NativeTabs.Trigger.Label>Avisos</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="bell.fill" md="notifications" />
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="permisos">
        <NativeTabs.Trigger.Label>Permisos</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="checkmark.shield.fill" md="verified_user" />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
