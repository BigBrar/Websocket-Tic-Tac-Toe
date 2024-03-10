let total_moves = 0;
let current_user = 'x';
let wins_x = 0;
let wins_o = 0;
total_ties = 0;
let previous_user = 'o';
let winner = false;
let global_opacity_change_block = [];

const winningMoves = [
    ["upper-left-button", "middle-left-button", "bottom-left-button"],
    ["upper-middle-button", 'middle-middle-button', 'bottom-middle-button'],
    ['upper-right-button', 'middle-right-button', 'bottom-right-button'],
    ['upper-left-button', 'upper-middle-button', 'upper-right-button'],
    ['middle-left-button', 'middle-middle-button', 'middle-right-button'],
    ['bottom-left-button', 'bottom-middle-button', 'bottom-right-button'],
    ['upper-left-button', 'middle-middle-button', 'bottom-right-button'],
    ['upper-right-button', 'middle-middle-button', 'bottom-left-button']
] 



const buttons = document.querySelectorAll('.upper-left-button');
buttons.forEach(button => {
    button.addEventListener('click', event => {
        const clickedButton = event.target;
        total_moves++;
        if (clickedButton.textContent){
            console.log("nothing happens...")}
        else if (winner){
            console.log("nothing happens...2.0")
        }    
        else if(total_moves == 9){
            if(check_moves()){console.log("A winner has been announced...")}else{
                document.querySelector('.result-announce').textContent = "It is a TIE...";
                winner = true;
                total_ties++;
                document.querySelector('.win-tie').textContent = `Total Ties: ${total_ties}`;
                if (!clickedButton.textContent){
                    clickedButton.textContent = current_user;
                    check_moves();
                    console.log(`Button "${clickedButton.textContent}" was clicked.`);
                }
                    }
        }else{
            move_swap();
            if (!clickedButton.textContent){
                clickedButton.textContent = current_user;
                clickedButton.setAttribute("style","font-size:35px;");
            check_moves();
            }
        }
            // You can perform other actions based on the clicked button
    });
});



function move_swap(){
    if (current_user == 'x'){
        current_user = 'o';
    }else{
        current_user= 'x';
    }

}

function check_moves(){
    if (total_moves > 3){
        check_if_won_array('o');
        check_if_won_array('x');
    }
    if (winner){
        return true
    }
    return false
}

function check_if_won_array(symbol){

    for (const condition of winningMoves){
        let block = 0;
       let opacity_change_block = [];
        // if (condition.every(button => document.getElementById(condition).textContent === symbol)){
        //     console.log('The player has won...', symbol);
        // }
        for (const every_condition of condition){
            if (document.getElementById(every_condition).textContent === symbol){
                opacity_change_block.push(`${every_condition}-opacity`);
                // console.log("One block met...");
                block++;
            }
        }
        if (block === 3){
            console.log("one condition matches so ",symbol," wins...");
            document.querySelector('.result-announce').textContent = `${symbol} has won...`; 
            winner = true;
            for (element of opacity_change_block){
                // document.querySelector(`${element}`).style.opacity = 1;
                document.getElementById(element).setAttribute("style","font-size:50px;")
                // console.log("For loop ran...")
                // console.log(element);
            }
            global_opacity_change_block = opacity_change_block;
            if (symbol === 'x'){
                wins_x++;
                document.querySelector('.win-x').textContent = `Total wins of x: ${wins_x}`;
            }else if (symbol === 'o'){
                wins_o++
                document.querySelector('.win-o').textContent = `Total wins of o: ${wins_o}`;
            }
            break
        }   
    }
}


function reset_values(){
    for (const button of buttons){
        button.textContent = ""; 
    }
    total_moves=0;
        winner = false;
    for (element of global_opacity_change_block){
            // document.querySelector(`${element}`).style.opacity = 1;
            document.getElementById(element).setAttribute("style","font-size:0px;")
            // console.log("For loop ran...")
            // document.getElementsByClassName("upper-left-button").setAttribute("style","font-size:50px;")
            // console.log(element);
        }
        let button_elements = document.getElementsByClassName('upper-left-button');
    for (element of button_elements){
        element.setAttribute("style","font-size:0px;");
    }    
}