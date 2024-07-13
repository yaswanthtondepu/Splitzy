import { groupItemsByPersons } from '../lib/utils';
import { ItemsState } from '@/contexts/PageContext';
import { commentBuilder } from '../lib/utils';

describe('groupItemsByPersons', () => {
    it('should correctly group items by persons involved and sort by count in descending order', () => {
        const itemsState: ItemsState[] = [
            { id: '1', item: { name: 'Item A', image: 'item-a.jpg', price: '10' }, tax: 5, selectedPersons: [{ name: 'Alice', id: 1 }, { name: 'Bob', id: 2 }] },
            { id: '2', item: { name: 'Item B', image: 'item-b.jpg', price: '15' }, tax: 8, selectedPersons: [{ name: 'Alice', id: 1 }] },
            { id: '3', item: { name: 'Item C', image: 'item-c.jpg', price: '20' }, tax: 3, selectedPersons: [{ name: 'Charlie', id: 3 }, { name: 'David', id: 4 }] },
            { id: '4', item: { name: 'Item D', image: 'item-d.jpg', price: '12' }, tax: 6, selectedPersons: [{ name: 'Alice', id: 1 }, { name: 'Bob', id: 2 }, { name: 'Eve', id: 5 }] },
            { id: '5', item: { name: 'Item E', image: 'item-e.jpg', price: '18' }, tax: 4, selectedPersons: [{ name: 'Bob', id: 2 }, { name: 'Alice', id: 1 }] },
        ];

        const result = groupItemsByPersons(itemsState);

        // Assert the structure of the result
        expect(Object.keys(result)).toEqual([
            "Alice, Bob, Eve",
            "Alice, Bob",
            "Charlie, David",
            "Alice",
        ]);

        // Assert the grouping and sorting correctness
        expect(result["Alice, Bob"]).toHaveLength(2);
        expect(result["Alice"]).toHaveLength(1);
        expect(result["Charlie, David"]).toHaveLength(1);
        expect(result['Alice, Bob, Eve']).toHaveLength(1);
        expect(result['Alice, Bob'][0].id).toBe('1'); // Example assertion
        console.log(commentBuilder("Test Description", itemsState))
    });


    it('should return an empty object for an empty input array', () => {
        const itemsState: ItemsState[] = [];
        const result = groupItemsByPersons(itemsState);
        expect(result).toEqual({});
    });


    it('should return an empty object for an empty input array', () => {
        const itemsState: ItemsState[] = [];

        const result = groupItemsByPersons(itemsState);

        expect(result).toEqual({});
    });


    it('should return an empty object for an empty input array', () => {
        const itemsState: ItemsState[] = [];

        const result = groupItemsByPersons(itemsState);

        expect(result).toEqual({});
    });


});


