export const roomsData = [
  { id: 1, number: 'A-101', capacity: 3, occupants: ['Rajesh Kumar', 'Amit Patel'], occupantIds: [101, 102], status: 'partial', floor: 'A', block: 'A Block', facilities: ['Bed', 'Study Table', 'Wardrobe', 'Fan', 'Light', 'Wi-Fi'] },
  { id: 2, number: 'A-102', capacity: 3, occupants: [], occupantIds: [], status: 'available', floor: 'A', block: 'A Block', facilities: ['Bed', 'Study Table', 'Wardrobe', 'Fan', 'Light', 'Wi-Fi'] },
  { id: 3, number: 'A-103', capacity: 2, occupants: ['Priya Sharma'], occupantIds: [103], status: 'partial', floor: 'A', block: 'A Block', facilities: ['Bed', 'Study Table', 'Wardrobe', 'Fan', 'Light'] },
  { id: 4, number: 'B-101', capacity: 3, occupants: ['Sneha Reddy', 'Vikram Singh', 'Ananya Desai'], occupantIds: [104, 105, 106], status: 'full', floor: 'B', block: 'B Block', facilities: ['Bed', 'Study Table', 'Wardrobe', 'Fan', 'Light', 'Wi-Fi', 'AC'] },
  { id: 5, number: 'B-102', capacity: 2, occupants: [], occupantIds: [], status: 'available', floor: 'B', block: 'B Block', facilities: ['Bed', 'Study Table', 'Wardrobe', 'Fan', 'Light'] },
  { id: 6, number: 'B-103', capacity: 3, occupants: ['Rahul Mehta'], occupantIds: [107], status: 'partial', floor: 'B', block: 'B Block', facilities: ['Bed', 'Study Table', 'Wardrobe', 'Fan', 'Light', 'Wi-Fi'] },
  { id: 7, number: 'C-101', capacity: 2, occupants: ['Neha Gupta', 'Kunal Verma'], occupantIds: [108, 109], status: 'full', floor: 'C', block: 'C Block', facilities: ['Bed', 'Study Table', 'Wardrobe', 'Fan', 'Light', 'AC'] },
  { id: 8, number: 'C-102', capacity: 3, occupants: [], occupantIds: [], status: 'available', floor: 'C', block: 'C Block', facilities: ['Bed', 'Study Table', 'Wardrobe', 'Fan', 'Light', 'Wi-Fi'] },
  { id: 9, number: 'C-103', capacity: 2, occupants: ['Divya Sharma'], occupantIds: [110], status: 'partial', floor: 'C', block: 'C Block', facilities: ['Bed', 'Study Table', 'Wardrobe', 'Fan', 'Light'] },
  { id: 10, number: 'D-101', capacity: 3, occupants: ['Arjun Reddy', 'Pooja Singh'], occupantIds: [111, 112], status: 'partial', floor: 'D', block: 'D Block', facilities: ['Bed', 'Study Table', 'Wardrobe', 'Fan', 'Light', 'Wi-Fi'] },
];

export const getRoomById = (id) => roomsData.find(room => room.id === id);
export const getRoomsByStatus = (status) => roomsData.filter(room => room.status === status);
export const getAvailableRooms = () => roomsData.filter(room => room.status === 'available');