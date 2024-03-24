import asyncio
import websockets

winningMoves = [
    ["upper-left-button", "middle-left-button", "bottom-left-button"],
    ["upper-middle-button", 'middle-middle-button', 'bottom-middle-button'],
    ['upper-right-button', 'middle-right-button', 'bottom-right-button'],
    ['upper-left-button', 'upper-middle-button', 'upper-right-button'],
    ['middle-left-button', 'middle-middle-button', 'middle-right-button'],
    ['bottom-left-button', 'bottom-middle-button', 'bottom-right-button'],
    ['upper-left-button', 'middle-middle-button', 'bottom-right-button'],
    ['upper-right-button', 'middle-middle-button', 'bottom-left-button']
] 


connected_users = 0
waiting_socket = None
total_msg = 0
first_user = None
second_user = None
clients = []

async def increment_user(websocket):
    global connected_users
    connected_users+=1
    await websocket.send(f'Total connected users are - {connected_users}')

async def increment_messages(websocket):
    global total_msg
    total_msg+=1
    await websocket.send(f'Total messages are - {total_msg}')

async def put_waiting(websocket):
    # global waiting_socket
    # global first_user
    global clients
    # waiting_socket=websocket
    # first_user = websocket
    clients.append([websocket])
    
    await websocket.send("finding_random_player")

async def done_waiting(websocket):
    # global waiting_socket
    # global second_user
    # second_user = websocket
    if len(clients[-1]) == 1:
        clients[-1].append(websocket)
        await clients[-1][0].send("your_move")
        await websocket.send("second_move")
    else:
        print("something went wrong....")
        
    # waiting_socket = False

async def handle_message(websocket,path):
    try:
        if len(clients) == 0: #check if there are values in clients list
            await put_waiting(websocket)
        if len(clients[-1]) == 2: # check if the last element length of clients list is 2
            await put_waiting(websocket) #tell the user to wait for other player connection
        elif len(clients[-1]) == 1 and clients[-1][0] != websocket : # check if the last element length is only one...
            await done_waiting(websocket)
        # await websocket.send("You are connected to the server...")
        # await increment_user(websocket)
        while True:
            message = await websocket.recv()
            if message == "i_won":
                print("Someone won...")  
            
            elif message is None:
                for things in clients:
                    if websocket in things:
                        if things[0] == websocket:
                            await things[1].send('client_disconnected')
                        elif things[1] == websocket:
                            await things[0].send('client_disconnected')   

            elif message == "restart_game":
                for things in clients:
                    if websocket in things:
                        if things[0] == websocket:
                            await things[1].send('restart_game')
                        elif things[1] == websocket:
                            await things[0].send('restart_game')   
            
            elif message == "client_disconnected":
                try:
                    for things in clients:
                        if websocket in things:
                            if things[0] == websocket:
                                await things[1].send('client_disconnected')
                            elif things[1] == websocket:
                                await things[0].send('client_disconnected')   
                except:
                    pass
            
            elif message == 'restart_accepted':
                for things in clients:
                    if websocket in things:
                        if things[0] == websocket:
                            await things[1].send('restart_accepted')
                            await things[1].send('your_move')
                            await increment_messages(things[1])
                        elif things[1] == websocket:
                            await things[0].send('restart_accepted')  
                            await things[0].send('your_move')  
                            

            for things in clients:
                if websocket in things:
                    if things[0] == websocket:
                        await things[1].send(message)
                        await increment_messages(things[1])
                    elif things[1] == websocket:
                        await things[0].send(message)
                        await increment_messages(things[0])
    except websockets.exceptions.ConnectionClosedOK:
        for things in clients:
                if websocket in things:
                    if things[0] == websocket:
                        await things[1].send("client_disconnected")
                        await increment_messages(things[1])
                    elif things[1] == websocket:
                        await things[0].send('client_disconnected')
                        await increment_messages(things[0])
        # if websocket in clients:
        #     await second_user.send(message)
        # elif websocket == second_user:
        #     await first_user.send(message)
        # await increment_messages(websocket)
    # print('message sent..')


async def start_server():
    async with websockets.serve(handle_message, "localhost", 8865):
        print("websocket server started ")
        await asyncio.Future()

asyncio.run(start_server())