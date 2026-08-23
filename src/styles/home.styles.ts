import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  center: {
    flex: 1,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  updatedAt: {
    color: '#666',
    fontSize: 11,
  },
  heading: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
  },
  subheading: {
    color: '#888',
    marginTop: 4,
    marginBottom: 16,
  },
  list: {
    paddingBottom: 30,
  },
  dayHeading: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 18,
    marginBottom: 8,
  },
  card: {
    backgroundColor: '#1c1c1e',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  currencyBadge: {
    backgroundColor: '#333',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 7,
  },
  currency: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
  },
  time: {
    color: '#aaa',
    fontSize: 13,
    marginLeft: 10,
  },

  impactBadge: {
    backgroundColor: '#dd3b30',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 7,
    marginLeft: 'auto',
  },
  impact: {
    color: 'white',
    fontWeight: '700',
    fontSize: 10,
  },
  title: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  dataRow: {
    flexDirection: 'row',
    gap: 18,
    marginTop: 7,
  },
  data: {
    color: '#ccc',
    fontSize: 12,
  },
  loadingText: {
    color: 'white',
    marginTop: 10,
  },
  error: {
    color: '#ff453a',
  },
  versionText: {
    color: '#555',
    fontSize: 11,
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 12,
  },

  emptyState: {
    paddingVertical: 24,
    paddingHorizontal: 4,
  },

  emptyStateTitle: {
    color: '#aaa',
    fontSize: 15,
    fontWeight: '600',
  },

  emptyStateText: {
    color: '#666',
    fontSize: 13,
    marginTop: 4,
  },

  updatedAtRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  updatedAtStale: {
    color: '#d6a84b',
  },

  cardPast: {
    backgroundColor: '#18181a',
  },

  currencyBadgePast: {
    backgroundColor: '#2a2a2c',
  },

  impactBadgePast: {
    backgroundColor: '#6e2723',
  },

  impactPast: {
    color: '#d19a96',
  },

  titlePast: {
    color: '#bbb',
  },

  textPast: {
    color: '#8a8a8a',
  },

  newsFilter: {
    flexDirection: 'row',
    backgroundColor: '#1c1c1e',
    borderRadius: 10,
    padding: 3,
    marginBottom: 8,
  },

  newsFilterButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 8,
  },

  newsFilterButtonActive: {
    backgroundColor: '#333',
  },

  newsFilterText: {
    color: '#777',
    fontSize: 13,
    fontWeight: '600',
  },

  newsFilterTextActive: {
    color: '#fff',
  },
});
