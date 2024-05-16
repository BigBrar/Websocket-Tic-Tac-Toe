let total_moves = 0;
let current_user = 'x';
let wins_x = 0;
let wins_o = 0;
total_ties = 0;
let previous_user = 'o';
let winner = false;
let global_opacity_change_block = [];
let player_mode = "Multiplayer OFF!!!";
let ai_mode = "AI OFF!!!";
let ai_on = false;
let multiplayer_on = false;
let socket;
let enemy_move;
let new_moves = [["upper-left-button", "upper-middle-button", "upper-right-button"],['middle-left-button', 'middle-middle-button', 'middle-right-button'],['bottom-left-button', 'bottom-middle-button', 'bottom-right-button']];
let correct_moves = [[null, null, null],[null, null, null],[null, null, null]];

let first_line = ["upper-left-button", "upper-middle-button", "upper-right-button"];
let second_line = ['middle-left-button', 'middle-middle-button', 'middle-right-button']
let third_line = ['bottom-left-button', 'bottom-middle-button', 'bottom-right-button']

let first_move = false;

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

function fetchAIReponse(board) {
    const boardParam = encodeURIComponent(JSON.stringify(board));
    // const url = `https://1ef2f89a-734f-4e20-ba5b-e50c06127709-00-11jwbv1kiwbxu.riker.repl.co/?board=${boardParam}`;
    const url = 'https://www.google.com/';

    return fetch(url, {
        mode: 'no-cors'
      })
        .then(response => {
            if (!response.ok) {
                throw new Error('resopnse',response.json);
                console.log("Response is ",response.json);
            }
            return response.json();
        })
        .then(data => {
            return data;
        })
        // .catch(error => {
        //     throw new Error('Error fetching data:', error);
        //     console.log("Response is - ",response.json)
        // });
}
// // Example usage:
// const board = [['X', null, null], [null, null, null], [null, null, null]];
//     fetchAIReponse(board)
//     .then(data => {
//         console.log('Response:', data);
//     })
//     .catch(error => {
//         console.error(error);
//     });

function register_move(user_move,user){ //for getting and making AI move 
    if (first_line.includes(user_move)){
        index = new_moves[0].indexOf(user_move)
        console.log("First if executed")
        console.log("The index is - ",index)
        console.log("the value of the index is",first_line[index])
        best_move = fetchAIReponse(correct_moves);
        // best_move = 'upper-left-button';
        move_swap();
        update_button_content(best_move);
        check_if_won_array_socket('x');
        check_if_won_array_socket('o');
    }

    else if (second_line.includes(user_move)){
        index = new_moves[1].indexOf(user_move)
        console.log("Second if executed")
        console.log("The index is - ",index)
        console.log("the value of the index is",second_line[index])
        correct_moves[1][index] = user;
        best_move = fetchAIReponse(correct_moves);
        move_swap();
        update_button_content(best_move);
        check_if_won_array_socket('x');
        check_if_won_array_socket('o');
    }

    else if (third_line.includes(user_move)){
        index = new_moves[2].indexOf(user_move)
        console.log("Third if executed")
        console.log("The index is - ",index)
        console.log("the value of the index is",third_line[index])
        correct_moves[2][index] = user;
        best_move = fetchAIReponse(correct_moves);
        move_swap();
        update_button_content(best_move);
        check_if_won_array_socket('x');
        check_if_won_array_socket('o');
    }
    else{
        console.log("The user move is ",typeof(user_move))
    }
}


// function get_ai_move(currnet_mvoes) {
//     fetch('https://www.google.com')
//       .then(response => {
//         if (!response.ok) {
//           throw new Error('Network response was not ok ' + response.statusText);
//         }
//         return response.text();
//       })
//       .then(html => console.log(html))
//       .catch(error => console.error('There has been a problem with your fetch operation:', error));
//   }
  



function toggle_player_mode(){
    player_mode_button = document.getElementById('player-mode-button')
    if (player_mode_button.textContent === player_mode){
        document.getElementById('player-mode-button').textContent = "Multiplayer ON!!!"
        multiplayer_on = true;
        websocket_connect();
    }
    else{
        document.getElementById('player-mode-button').textContent = player_mode;
        document.querySelector('.loading-animation').style.display = 'none'
        multiplayer_on = false;
        socket.close()
    }
}

function toggle_ai_mode(){ //for turning on AI mode..
    ai_mode_button = document.getElementById('player-mode-button-2')
    if (ai_mode_button.textContent === ai_mode){
        document.getElementById('player-mode-button-2').textContent = "AI ON!!!"
        ai_on = true;
    }
    else{
        document.getElementById('player-mode-button-2').textContent = ai_mode;
        document.querySelector('.loading-animation').style.display = 'none';
        ai_on = true;
        // socket.close()s
    }
}

function websocket_connect(){ //for handling websockets connections...
    // document.querySelector('.loading-animation').style.display = 'flex'
    console.log("1st if statement")
    socket = new WebSocket('ws://localhost:8865');
    socket.onmessage = function(event) {
        // console.log('Message from server:', event.data);
        if (event.data == 'finding_random_player'){
            document.querySelector('.loading-animation').style.display = 'flex'
            console.log("1st if statement")
        }

        else if (event.data == 'your_move'){
            console.log("2nd if statement")
            document.querySelector('.loading-animation').style.display = 'none'
            console.log("Message from the server ",event.data)
            first_move = true;
            current_user = 'x';
            check_if_won_array_socket('x');
            check_if_won_array_socket('o');
        }

        else if (event.data == 'second_move'){
            console.log("3rd if statement")
            current_user = 'x';
            check_if_won_array('x');
            check_if_won_array_socket('o');
            console.log("Message from the server ",event.data);
        }

        else if(event.data == 'client_disconnected'){
            console.log("4th if statement");
            alert("Your opponent has disconnected...");
        }

        else if(event.data == 'restart_game'){
            console.log("Restart game requested...")
            if (window.confirm("Your opponent wants to have a rematch...")) {
                for (const button of buttons){
                    button.textContent = ""; 
                }
                total_moves=0;
                    winner = false;
                    first_move = false;
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
                socket.send("restart_accepted")
              } else {
                socket.send("restart_declined")
              }
        }
        else{
            if (winner){
                console.log("Someone won..")
                console.log("5th if statement")
            }
            else{
                console.log("6th if statement")
                enemy_move = event.data;
                update_button_content(enemy_move);
                check_if_won_array_socket('x');
                check_if_won_array_socket('o');
                }
        }
    };
}

function update_button_content(button_name){
    document.getElementById(button_name).textContent = current_user;
    document.getElementById(button_name).setAttribute("style","font-size:35px;");
    first_move = true;
}

function send_move_server(move){
    first_move = false;
    socket.send(move);
}

const buttons = document.querySelectorAll('.upper-left-button');
buttons.forEach(button => {
    button.addEventListener('click', event => {
        const clickedButton = event.target;
        total_moves++;
        if (ai_on){
            
            if (clickedButton.textContent){
                console.log("nothing happens...")}
            else if (winner){
                console.log("nothing happens...2.0")
            }    
            else if(total_moves == 9){
                if(check_moves()){console.log("A winner has been announced...")
                }
                else{
                    document.querySelector('.result-announce').textContent = "It is a TIE...";
                    winner = true;
                    total_ties++;
                    document.querySelector('.win-tie').textContent = `Total Ties: ${total_ties}`;
                }
                if (!clickedButton.textContent){
                    move_swap();
                    clickedButton.textContent = current_user;
                    console.log(`Button "${clickedButton.textContent}" was clicked. \ nCurrent user is - ${current_user}`);
                    clickedButton.setAttribute("style","font-size:35px;");
                    check_if_won_array('o');
                }
            }else{
                move_swap();
                if (!clickedButton.textContent){
                    clickedButton.textContent = current_user;
                    clickedButton.setAttribute("style","font-size:35px;");
                    console.log("Function ran...")
                    register_move(clickedButton.id,current_user);
                    check_moves();
                }
             }   
        }
        if (!multiplayer_on){
            
            if (clickedButton.textContent){
                console.log("nothing happens...")}
            else if (winner){
                console.log("nothing happens...2.0")
            }    
            else if(total_moves == 9){
                if(check_moves()){console.log("A winner has been announced...")
                }
                else{
                    document.querySelector('.result-announce').textContent = "It is a TIE...";
                    winner = true;
                    total_ties++;
                    document.querySelector('.win-tie').textContent = `Total Ties: ${total_ties}`;
                }
                if (!clickedButton.textContent){
                    move_swap();
                    clickedButton.textContent = current_user;
                    console.log(`Button "${clickedButton.textContent}" was clicked. \ nCurrent user is - ${current_user}`);
                    clickedButton.setAttribute("style","font-size:35px;");
                    check_if_won_array('o');
                }
                        
            }else{
                move_swap();
                if (!clickedButton.textContent){
                    clickedButton.textContent = current_user;
                    clickedButton.setAttribute("style","font-size:35px;");
                check_moves();
                }
             }   
    }

    else if (multiplayer_on){
        
        if (clickedButton.textContent){
            console.log("nothing happens...")}

        else if (winner){
            console.log("nothing happens...2.0")
        }   

        else{
            if (first_move){
                current_user = 'o'
                clickedButton.textContent = current_user;
                clickedButton.setAttribute("style","font-size:35px;");
                send_move_server(clickedButton.id);
                check_if_won_array_socket('x')
                check_if_won_array_socket('o')
                move_swap();
            }
            else if (!first_move){
                alert("Waiting for other player to make a move....")
            }
            
        }
    }
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


function check_if_won_array_socket(symbol){

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
            socket.send("i_won")
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
    if (!multiplayer_on){
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

    else if(multiplayer_on){
        if (winner){
            socket.send("restart_game")
            console.log("Restart game ...")
            for (const button of buttons){
                button.textContent = ""; 
            }
            total_moves=0;
                winner = false;
                first_move=false;
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
        else{
            console.log("Nothing will happen...")
        }
    }
}