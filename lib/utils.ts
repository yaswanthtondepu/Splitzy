import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ItemsState, GroupedItemsByPersons } from "@/contexts/PageContext";
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function findItemsTotal (expenses:any) {
   return parseFloat( expenses.reduce((accumulator:any, expense:any) =>accumulator + expense.amount,0).toFixed(2))
}

export function commentBuilder(description :string, itemsState:ItemsState[]){
    let groupedItems = groupItemsByPersons(itemsState);
    let comment:string = ""
    comment += " ---------- Splitzy -------------\n"
    comment += ` -------  ${description}  -----------\n`
    
    Object.keys(groupedItems).forEach(key=>{
        if(key.split(',').length ===1){
            comment += `Split for ${key}\n`
        }
        else{
            comment += `Split involving ${key}\n`
        }
        groupedItems[key].forEach(itemState=>{
            comment += "   "+itemState.item.name +"         "+ itemState.item.price+"\n"
        })
    })
    return comment


}


export function groupItemsByPersons(itemsState: ItemsState[]): GroupedItemsByPersons {
    // Create an object to store groups
    const groupedItems: GroupedItemsByPersons = {};

    // Iterate through each item in itemsState
    itemsState.forEach(item => {
        // Sort selected persons by id to create a consistent key
        const sortedPersons = item.selectedPersons.sort((a, b) => a.id - b.id);
        const key:string =  sortedPersons.map(person => person.name).join(', ');

        // Check if the group exists for this key
        if (!groupedItems[key]) {
            groupedItems[key] = [];
        }

        // Add the item to the corresponding group
        groupedItems[key].push(item);
    });

    // Convert object to array for sorting
    const groupedItemsArray = Object.entries(groupedItems).map(([key, value]) => ({
        key,
        items: value,
        numPersons: key.split(",").length // Calculate number of persons involved
    }));

    // Sort the array by number of persons involved in descending order
    groupedItemsArray.sort((a, b) => b.numPersons - a.numPersons);

    // Convert sorted array back to object
    const sortedGroupedItems: GroupedItemsByPersons = {};
    groupedItemsArray.forEach(({ key, items }) => {
        sortedGroupedItems[key] = items;
    });

    return sortedGroupedItems;
}