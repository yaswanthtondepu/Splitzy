import { commentBuilder } from '../lib/utils';




function checkCommentBuilderOutput(){
    const itemsState = [
        { id: '1', item: { name: 'Item A', image: 'item-a.jpg', price: '10' }, tax: 5, selectedPersons: [{ name: 'Alice', id: 1 }, { name: 'Bob', id: 2 }] },
        { id: '2', item: { name: 'Item B', image: 'item-b.jpg', price: '15' }, tax: 8, selectedPersons: [{ name: 'Alice', id: 1 }] },
        { id: '3', item: { name: 'Item C', image: 'item-c.jpg', price: '20' }, tax: 3, selectedPersons: [{ name: 'Charlie', id: 3 }, { name: 'David', id: 4 }] },
        { id: '4', item: { name: 'Item D', image: 'item-d.jpg', price: '12' }, tax: 6, selectedPersons: [{ name: 'Alice', id: 1 }, { name: 'Bob', id: 2 }, { name: 'Eve', id: 5 }] },
        { id: '5', item: { name: 'Item E', image: 'item-e.jpg', price: '18' }, tax: 4, selectedPersons: [{ name: 'Bob', id: 2 }, { name: 'Alice', id: 1 }] },
    ];

    console.log(commentBuilder("Walamart expenses",itemsState))
}

checkCommentBuilderOutput()

