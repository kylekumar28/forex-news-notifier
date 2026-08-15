import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1c1c1e',
    borderRadius: 14,
    padding: 16,
    marginTop: 12,
    marginBottom: 8,
  },

  label: {
    color: '#666',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.7,
    marginBottom: 12,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },

  currency: {
    color: '#aaa',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 3,
  },

  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },

  impactBadge: {
    backgroundColor: '#dd3b30',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 7,
    marginLeft: 10,
  },

  impact: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },

  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },

  date: {
    color: '#888',
    fontSize: 13,
  },

  countdown: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },

  clearTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  clearText: {
    color: '#888',
    fontSize: 13,
    marginTop: 4,
  },
});