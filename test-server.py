import asyncio
import websockets


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
    global clients
    clients.append([websocket])
    await websocket.send("finding_random_player")

async def send_to_other_player(websocket,message):
    for things in clients:
                    if websocket in things:
                        if things[0] == websocket:
                            await things[1].send(message)
                        elif things[1] == websocket:
                            await things[0].send(message)  

async def done_waiting(websocket):
    if len(clients[-1]) == 1:
        clients[-1].append(websocket)
        await clients[-1][0].send("your_move")
        await websocket.send("second_move")

    else:
        print("something went wrong....")
        

async def handle_message(websocket,path):
    try:
        if len(clients) == 0: #check if there are values in clients list
            await put_waiting(websocket)

        if len(clients[-1]) == 2: # check if the last element length of clients list is 2
            await put_waiting(websocket) #tell the user to wait for other player connection

        elif len(clients[-1]) == 1 and clients[-1][0] != websocket : # check if the last element length is only one...
            await done_waiting(websocket)
        
        while True:
            message = await websocket.recv() #keep receiving messages again and again
            if message == "i_won": #if someone won
                print("Someone won...")  
            
            elif message is None:
                await send_to_other_player(websocket, "client_disconnected")

            elif message == "restart_game": #if some user requested to restart the game ask the other user consent.
                await send_to_other_player(websocket, "restart_game")
            
            elif message == "client_disconnected": #tell the user his opponent disconnected..
                try:
                    await send_to_other_player(websocket, "client_disconnected")
                except:
                    await send_to_other_player(websocket, "client_disconnected")
            
            elif message == 'restart_accepted': #tell the user his restart game request got accepted by opponent
                for things in clients:
                    if websocket in things:
                        if things[0] == websocket:
                            await things[1].send('restart_accepted')
                            await things[1].send('your_move') #telling the user who put restart request to have the first move
                            await increment_messages(things[1])
                        elif things[1] == websocket:
                            await things[0].send('restart_accepted')  
                            await things[0].send('your_move')  #telling the user who put restart request to have the first move
                            

            await send_to_other_player(websocket, message) #send user move to one another...
    except websockets.exceptions.ConnectionClosedOK: #handling disconnected exception
        try:
            await send_to_other_player(websocket, "client_disconnected")
        except:
            pass


async def start_server():
    async with websockets.serve(handle_message, "localhost", 8865):
        print("websocket server started ")
        await asyncio.Future()

asyncio.run(start_server())