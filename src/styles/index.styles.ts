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
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
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
  date: {
    color: '#aaa',
    marginTop: 6,
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
  emptyText: {
    color: '#888',
    textAlign: 'center',
    marginTop: 40,
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
    paddingHorizontal: 4
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

  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 10,
  },

  filterLabel: {
    color: '#888',
    fontSize: 12,
    fontWeight: '600',
  },

  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1c1c1e',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
  },

  filterButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },

  currencyFilter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    backgroundColor: '#1c1c1e',
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
  },

  currencyFilterButton: {
    width: '31%',
    paddingVertical: 9,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#29292b',
  },

  currencyFilterButtonSelected: {
    backgroundColor: '#fff',
  },

  currencyFilterText: {
    color: '#888',
    fontSize: 12,
    fontWeight: '700',
  },

  currencyFilterTextSelected: {
    color: '#111',
  },

  updatedAtRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  updatedAtStale: {
    color: '#d6a84b',
  },
});
