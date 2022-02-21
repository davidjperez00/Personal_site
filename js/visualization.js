// This code creates a visual with html elemets of the quickSort algorithm 
// with partitions taken from the center.
// David Perez
// 1/15/2022

let ITERATIONCOUNT = 0;

function swap(arr, first, second) {
  var temp = arr[first];
  arr[first] = arr[second];
  arr[second] = temp;
}


function stateChange(i, cells) {
  return new Promise((resolve) => {setTimeout( function () {
      // if (i >= 1){
      //   cells[i-1].style.backgroundColor = 'white';
      // }
      cells[i].style.backgroundColor = 'white';
      cells[i+1].style.backgroundColor = 'red';      
      resolve();
    }, 1000);
    });
}

function decrementor(j, arrLength, cells) {
    return new Promise((resolve) => {setTimeout( function () {
      // if(j <= arrLength - 2){
      //   cells[j+1].style.backgroundColor = 'white';
      // }
      cells[j].style.backgroundColor = 'white';
      cells[j-1].style.backgroundColor = 'green';      
      resolve();
      }, 1000);
      });
}


function swapColorChange(i,j, cells, color) {
  return new Promise((resolve) => {setTimeout( function () {
      cells[i].style.backgroundColor = color;
      cells[j].style.backgroundColor = color;     
      resolve();
    }, 500);
    });
}


function updateTable(arr, i, j, cells){
  return new Promise((resolve) => {setTimeout( function () {
    // change the numbers of the table
    var temp = arr[i].toString();
    cells[i].innerHTML = arr[j].toString();
    cells[j].innerHTML = temp;

    // make swaped cells white again
    cells[i].style.backgroundColor = 'white';
    cells[j].style.backgroundColor = 'white';     
    
    // make soon to be new index cells their corresponding colors
    cells[i+1].style.backgroundColor = 'red';
    cells[j-1].style.backgroundColor = 'green'; 
    resolve();
  }, 500);
  });
}



function sorted(arr){
  let second_index;
  for(let first_index = 0; first_index < arr.length; first_index++){
      second_index = first_index + 1;
      if(arr[second_index] - arr[first_index] < 0) return false;
    }
  return true;
}




function displaySortedArray(arr){
  return new Promise((resolve) => {setTimeout( function () {

  // get container that all arrays will be in 
  let parentElement = document.getElementById("main");

  // Create our new div element and give it appropriate text
  let box = document.createElement('div');
  let text = document.createElement('p');
  text.innerHTML = 'Sorted Array';

  box.appendChild(text);

  // // Set the styles for the newly created box
  box.id = 'finalArr';

  // Create table and corresponding elements for table
  let newTable = document.createElement('table');
  let row = document.createElement('tr');
  newTable.appendChild(row);
  
  // populate the table with array elements
  for (element of arr){
    let head = document.createElement('td');
    head.innerHTML = element.toString();
    newTable.appendChild(head);
  }

  // add the table to the container
  box.appendChild(newTable);

  let cells = newTable.getElementsByTagName('td');

  for (cell of cells){
    cell.style.backgroundColor = 'yellow';
  }

  // Add box to 'main' container
  parentElement.appendChild(box);

  // automatically scroll so the user can see output
  window.scrollBy(0,1000);

  resolve();
  }, 200);
  });
}






// Main sorting function, the driver button calls
async function quickSort (arr, left, right, initialFlag) {
  let index;
  if(arr.length > 1){
    // make variables for partitioning
    let mid = Math.floor((left + right) / 2);
    let i = left;
    let j = right;
    let pivotElement = arr[mid];
  
    // Create Box that contains array and colored incrementers
    let cells = createPartitionBox(arr, i, j);
    cells[mid].style.backgroundColor = 'blue';

    // automatically scroll so user can see changes
    window.scrollBy(0,1000);

    while ( i <= j){
      while (arr[i] < pivotElement){
        await stateChange(i, cells);
        i++;
      }
      while (pivotElement < arr[j]){
        await decrementor(j, arr.length, cells);
        j--;
      }
      if (i <= j){

        /*
          color options:
          red
          gren
          yellow
          blue
          purple
          orange
          brown

          different combinations:
          i color: red
          j color: green
          mid color: blue


          i and mid: purple???
          j and mid: cyan??
          i and j:  yellow
        */

        // Don't forget to keep the mid element the same color
        await swapColorChange(i,j, cells,'purple');

        // swap cell #'s and change colors
        await updateTable(arr, i, j, cells);

        // Make the mid index blue again:
        cells[mid].style.backgroundColor = 'blue';

        // swap the actual variables
        swap(arr, i, j);
        i++;
        j--;
      }
    }
    index = i;

    // let multOfThree = ITERATIONCOUNT % 3;
    // if (multOfThree === 0 || ITERATIONCOUNT === 0){
    //   window.scrollBy(0,400);
    // }
    // ITERATIONCOUNT++;
    if (left < index - 1){
        await quickSort(arr, left, index-1, initialFlag++);
    }
    if (index < right){
      await quickSort(arr, index, right, initialFlag++);
    }
  } 

  return new Promise((resolve) => {setTimeout( function () {
    resolve();
  }, 10);
  });
}







function createPartitionBox(arr, i, j){
  // get container that all arrays will be in 
  let parentElement = document.getElementById("main");

  // Create our new div element and give it appropriate text
  let box = document.createElement('div');
  let text = document.createElement('p');
  text.innerHTML = 'Partition Iteration';

  box.appendChild(text);

  // // Set the styles for the newly created box
  box.id = 'arr0';
  // create table with array data that will be placed in box
  let cells = createTable(box, arr, i, j);

  // Add box to 'main' container
  parentElement.appendChild(box);
 
  return cells
}

function createTable(container, arr, i, j){
  // Create table and corresponding elements for table
  let newTable = document.createElement('table');
  let row = document.createElement('tr');
  newTable.appendChild(row);
  
  // populate the table with array elements
  for (element of arr){
    let head = document.createElement('td');
    head.innerHTML = element.toString();
    newTable.appendChild(head);
  }

  // add the table to the container
  container.appendChild(newTable);

  // initialy style the incrementers indexed elements
  let cells = newTable.getElementsByTagName('td');
  cells[i].style.backgroundColor = 'red';
  cells[j].style.backgroundColor = 'green';

  return cells;
}





async function driver(){
  // Get the inputed data from the user
  let inputText = document.getElementById("inputText").value;
  let numbers = inputText.split(',');

  // Parse the inputed data from the user
  let inputArray = [];
  let validInput = true;
  for(num of numbers){
    let isNumber = Number(num);
    if (isNaN(isNumber)){
      alert('Enter only digits please');
      validInput = false;
      break;
    }
    let number = parseFloat(num);
    inputArray.push(number);
  }


  let initialFlag = 0;
  if (validInput === true){
    await quickSort(inputArray, 0, inputArray.length -1, initialFlag);
    displaySortedArray(inputArray);
  }
}





/*      FINAL PROGRAM CHANGES

make keys to indicate what elements at same index would mean
  if 'i' and mid and same index give a unique color
  if 'j; and 'mid' at same index give unique color



*/
