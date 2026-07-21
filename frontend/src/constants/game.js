export const CATEGORIES = ['strategy', 'family', 'party', 'kids']

export const STATUSES = ['available', 'reserved', 'on_loan', 'retired']

export const CATEGORY_LABELS = {
  strategy: 'Strategy',
  family: 'Family',
  party: 'Party',
  kids: 'Kids',
}

export const STATUS_LABELS = {
  available: 'Available',
  reserved: 'Reserved',
  on_loan: 'On Loan',
  retired: 'Retired',
}

// The cycle is available -> reserved -> on_loan -> available. `retired` is a
// terminal status but can be reached from any active status (it represents a
// game being lost/damaged, which can happen at any point in the cycle).
const NEXT_IN_CYCLE = {
  available: 'reserved',
  reserved: 'on_loan',
  on_loan: 'available',
}

// Returns the set of statuses that should be selectable (enabled) in the
// status dropdown for a game currently in `status`. `retired` disables the
// control entirely, so callers should check that separately.
export function allowedNextStatuses(status) {
  const next = NEXT_IN_CYCLE[status]
  return new Set([next, 'retired'].filter(Boolean))
}
