// Seat selection grid for bus bookings
import { useMemo } from 'react'

const Seat = ({ seat, occupied, selected, locked, onSelect }) => {
  let classes =
    'h-9 w-9 sm:h-10 sm:w-10 rounded-lg text-xs font-semibold border transition flex items-center justify-center select-none '

  if (occupied) {
    classes += 'bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed'
  } else if (selected) {
    classes += 'bg-gradient-to-br from-[#061B62] to-[#168BFF] text-white border-transparent shadow-sm'
  } else if (locked) {
    classes += 'bg-white text-gray-300 border-gray-200 cursor-not-allowed'
  } else {
    classes += 'bg-white text-gray-600 border-gray-300 hover:border-blue-500 hover:bg-blue-50'
  }

  return (
    <button
      type="button"
      onClick={() => !occupied && onSelect(seat)}
      disabled={occupied}
      className={classes}
      aria-label={`Seat ${seat}${occupied ? ' (taken)' : selected ? ' (selected)' : ''}`}
    >
      {seat}
    </button>
  )
}

const Legend = ({ color, label }) => (
  <div className="flex items-center gap-1.5">
    <span className={`h-4 w-4 rounded border ${color}`} />
    <span>{label}</span>
  </div>
)

const SeatSelector = ({
  totalSeats = 40,
  occupiedSeats = [],
  selectedSeats = [],
  maxSelectable = 1,
  onSelect,
}) => {
  // Build rows of 4 seats (2-2 layout with an aisle in the middle)
  const rows = useMemo(() => {
    const perRow = 4
    const layout = []
    let n = 1
    while (n <= totalSeats) {
      const row = []
      for (let i = 0; i < perRow && n <= totalSeats; i++) row.push(n++)
      layout.push(row)
    }
    return layout
  }, [totalSeats])

  // A non-selected seat becomes "locked" once the passenger limit is reached
  const isLocked = (seat) =>
    !selectedSeats.includes(seat) && selectedSeats.length >= maxSelectable

  return (
    <div className="flex flex-col items-center gap-5">
      {/* Front of bus indicator */}
      <div className="w-full max-w-sm flex items-center justify-center gap-3 text-gray-400 text-xs font-medium">
        <span className="flex-1 h-px bg-gray-200" />
        Front of Bus
        <span className="flex-1 h-px bg-gray-200" />
      </div>

      <div className="flex flex-col gap-2.5">
        {rows.map((row, idx) => (
          <div key={idx} className="flex items-center justify-center gap-2">
            {/* Left pair */}
            <div className="flex gap-2">
              {row.slice(0, 2).map((seat) => (
                <Seat
                  key={seat}
                  seat={seat}
                  occupied={occupiedSeats.includes(seat)}
                  selected={selectedSeats.includes(seat)}
                  locked={isLocked(seat)}
                  onSelect={onSelect}
                />
              ))}
            </div>

            {/* Aisle */}
            <div className="w-6 sm:w-8" />

            {/* Right pair */}
            <div className="flex gap-2">
              {row.slice(2, 4).map((seat) => (
                <Seat
                  key={seat}
                  seat={seat}
                  occupied={occupiedSeats.includes(seat)}
                  selected={selectedSeats.includes(seat)}
                  locked={isLocked(seat)}
                  onSelect={onSelect}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 mt-1 text-xs text-gray-500">
        <Legend color="bg-gradient-to-br from-[#061B62] to-[#168BFF] border-transparent" label="Selected" />
        <Legend color="bg-white border-gray-300" label="Available" />
        <Legend color="bg-gray-200 border-gray-200" label="Taken" />
      </div>
    </div>
  )
}

export default SeatSelector
