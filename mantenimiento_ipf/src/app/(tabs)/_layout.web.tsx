import { Tabs, TabList, TabSlot, TabTrigger } from 'expo-router/ui';
import { StyleSheet } from 'react-native';

import { Texto } from '@/components/texto';
import { Cristal, Paleta } from '@/constants/theme';

// En web no hay tab bar nativo: se usa la versión headless de expo-router/ui.
export default function TabsLayoutWeb() {
  return (
    <Tabs>
      <TabSlot />
      <TabList style={styles.lista}>
        <TabTrigger name="index" href="/" style={styles.disparador}>
          <Texto variante="detalle">Reportes</Texto>
        </TabTrigger>
        <TabTrigger name="avisos" href="/avisos" style={styles.disparador}>
          <Texto variante="detalle">Avisos</Texto>
        </TabTrigger>
        <TabTrigger name="permisos" href="/permisos" style={styles.disparador}>
          <Texto variante="detalle">Permisos</Texto>
        </TabTrigger>
      </TabList>
    </Tabs>
  );
}

const styles = StyleSheet.create({
  lista: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    backgroundColor: Paleta.profundo,
    borderTopWidth: 1,
    borderTopColor: Cristal.borde,
  },
  disparador: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Cristal.borde,
    backgroundColor: Cristal.superficie,
  },
});
