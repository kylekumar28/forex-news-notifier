import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    paddingHorizontal: 16,
    paddingTop: 20,
  },

  heading: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },

  subheading: {
    color: '#888',
    marginTop: 4,
  },

  section: {
    marginTop: 28,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  sectionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    textTransform: 'uppercase',
  },

  selectedCount: {
    color: '#888',
    fontSize: 13,
  },

  description: {
    color: '#888',
    marginTop: 6,
    marginBottom: 16,
  },

  currencyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  currencyButton: {
    width: '30%',
    minWidth: 90,
    backgroundColor: '#1c1c1e',
    borderWidth: 1,
    borderColor: '#333',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },

  currencyButtonSelected: {
    backgroundColor: '#fff',
    borderColor: '#fff',
  },

  currencyText: {
    color: '#aaa',
    fontSize: 15,
    fontWeight: '700',
  },

  currencyTextSelected: {
    color: '#111',
  },

  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
  },

  actionButton: {
    flex: 1,
    backgroundColor: '#1c1c1e',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },

  actionText: {
    color: '#fff',
    fontWeight: '600',
  },

  card: {
    backgroundColor: '#1c1c1e',
    borderRadius: 14,
    padding: 16,
  },

  settingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
  },

  settingText: {
    flex: 1,
  },

  settingTitle: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },

  settingDescription: {
    color: '#888',
    marginTop: 4,
    lineHeight: 19,
  },

  intervalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    gap: 8,
  },

  intervalLabel: {
    color: '#ccc',
  },

  minutesInput: {
    minWidth: 58,
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: '#444',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
  },

  intervalSuffix: {
    color: '#ccc',
  },

  disabled: {
    opacity: 0.4,
  },

  preview: {
    marginTop: 20,
    backgroundColor: '#111',
    borderRadius: 10,
    padding: 14,
  },

  previewLabel: {
    color: '#666',
    fontSize: 11,
    textTransform: 'uppercase',
    fontWeight: '700',
    marginBottom: 8,
  },

  previewTitle: {
    color: '#fff',
    fontWeight: '700',
  },

  previewBody: {
    color: '#999',
    marginTop: 5,
    lineHeight: 18,
  },

  // status
  statusCard: {
    backgroundColor: '#1c1c1e',
    borderRadius: 14,
    padding: 16,
    marginTop: 20,
  },

  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },

  statusLabel: {
    color: '#888',
  },

  statusValue: {
    color: '#fff',
    fontWeight: '600',
  },

  statusActive: {
    color: '#30d158',
  },

  statusInactive: {
    color: '#ff453a',
  },

  // test section
  testSection: {
    marginTop: 30,
    padding: 16,
    backgroundColor: '#1c1c1e',
    borderRadius: 14,
  },

  testTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  testDescription: {
    color: '#888',
    marginTop: 5,
    marginBottom: 16,
  },

  testButton: {
    backgroundColor: '#dd3b30',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
  },

  testButtonText: {
    color: '#fff',
    fontWeight: '700',
  },

  // input accessory
  keyboardToolbar: {
    backgroundColor: '#1c1c1e',
    borderTopWidth: 1,
    borderTopColor: '#333',
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'flex-end',
  },

  keyboardDone: {
    color: '#0a84ff',
    fontSize: 17,
    fontWeight: '600',
  },
});
