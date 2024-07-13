import { commentBuilder } from '../lib/utils';




function checkCommentBuilderOutput(){
    const itemsState = [
        { id: '1', item: { name: 'Tyson All Natural Fully Cooked Chicken Nuggets, 4.4 lb Bag (Frozen)', image: 'item-a.jpg', price: '10' }, tax: 5, selectedPersons: [{ name: 'Alice', id: 1 }, { name: 'Bob', id: 2 }] },
        { id: '2', item: { name: 'Ocean Spray® 100% Juice Cranberry Juice Blend, 101.4 fl oz Bottle', image: 'item-b.jpg', price: '15' }, tax: 8, selectedPersons: [{ name: 'Alice', id: 1 }] },
        { id: '3', item: { name: 'Disposable Shot Cups 20ct', image: 'item-c.jpg', price: '20' }, tax: 3, selectedPersons: [{ name: 'Charlie', id: 3 }, { name: 'David', id: 4 }] },
        { id: '4', item: { name: 'Way To Celebrate Plastic Party Tablecloth, 108in x 54in, Black, 1ct', image: 'item-d.jpg', price: '12' }, tax: 6, selectedPersons: [{ name: 'Alice', id: 1 }, { name: 'Bob', id: 2 }, { name: 'Eve', id: 5 }] },
        { id: '5', item: { name: 'Way to Celebrate! 12inch Birthday Party Decoration Multi-Color Foil Confetti Balloons, 5 Counts', image: 'item-e.jpg', price: '18' }, tax: 4, selectedPersons: [{ name: 'Bob', id: 2 }, { name: 'Alice', id: 1 }] },
        { id: '6', item: { name: 'Way To Celebrate Royal Blue Holographic Curl Swirl, Polypropylene, Ribbon, 12 Ribbon Strand, Everyday, Celebration', image: 'item-e.jpg', price: '18' }, tax: 4, selectedPersons: [] },
        { id: '7', item: { name: 'Item E', image: 'item-e.jpg', price: '18' }, tax: 4, selectedPersons: [] },

    ];

    console.log(commentBuilder("Walamart expenses",itemsState))
}

checkCommentBuilderOutput()


