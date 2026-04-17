import RoomCard from './RoomCard';

export default function RoomGrid({ rooms, onAllocate }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
      {rooms.map((room) => (
        <RoomCard key={room.id} room={room} onAllocate={onAllocate} />
      ))}
    </div>
  );
}