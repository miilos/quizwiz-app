import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { apiGetAccessLog } from '../../api/rest';
import { C } from '../../theme';

interface AccessLogEntry {
  ip: string;
  deviceType: string;
  createdAt: string;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}.${mm}.${yyyy}.`;
}

export default function AdminAccessLogTab() {
  const [logs, setLogs] = useState<AccessLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const { res, json } = await apiGetAccessLog();
        if (res.ok) {
          setLogs(json.data.logs);
        } else {
          console.log('Access log error:', res.status, json);
          setError(`Error ${res.status}: ${json?.message ?? 'Failed to load access log.'}`);
        }
      } catch (e) {
        console.log('Access log exception:', e);
        setError('Network error.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color={C.primary} style={{ marginTop: 40 }} />;
  }

  if (error) {
    return <Text style={styles.error}>{error}</Text>;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.table}>
        <View style={[styles.row, styles.headerRow]}>
          <Text style={[styles.cell, styles.headerCell, styles.colIp]}>IP</Text>
          <Text style={[styles.cell, styles.headerCell, styles.colDevice]}>Device</Text>
          <Text style={[styles.cell, styles.headerCell, styles.colDate]}>Date</Text>
        </View>
        {logs.map((log, i) => (
          <View key={i} style={[styles.row, i % 2 === 1 && styles.rowAlt]}>
            <Text style={[styles.cell, styles.colIp]}>{log.ip}</Text>
            <Text style={[styles.cell, styles.colDevice]}>{log.deviceType}</Text>
            <Text style={[styles.cell, styles.colDate]}>{formatDate(log.createdAt)}</Text>
          </View>
        ))}
        {logs.length === 0 && (
          <Text style={styles.empty}>No log entries.</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },
  table: {
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 8,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  headerRow: {
    backgroundColor: C.primary,
  },
  rowAlt: {
    backgroundColor: C.readOnlyBg,
  },
  cell: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 13,
    color: C.textDark,
  },
  headerCell: {
    color: C.secondaryLight,
    fontWeight: '700',
    fontSize: 13,
  },
  colIp: { flex: 3 },
  colDevice: { flex: 2 },
  colDate: { flex: 2 },
  error: { color: C.errorMedium, textAlign: 'center', marginTop: 40 },
  empty: { color: C.textMuted, textAlign: 'center', padding: 24 },
});
