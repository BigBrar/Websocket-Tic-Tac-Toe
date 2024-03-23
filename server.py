import asyncio
import websockets

class GameOverException(Exception):
    pass

clients = []
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
first_client = None
second_client = None
fastest_time = 0
whose_move = 'first'
# first_move = False
total_moves = 0
# first_move_lock = asyncio.Lock()

async def add_clients(sender):
    # global clients
    if len(clients) == 0:
        clients.append([sender])
    elif type(clients[-1]) == list and len(clients[-1]) == 1:
        clients[-1].append(sender)
    elif type(clients[-1]) == list and len(clients[-1]) == 2:
        clients[-1].append([sender])

async def check_won(websocket,message):
    global connected_users
    print("Check won called...")
    if message == 'i_won':
        print("Wow, someone won...")
        connected_users = 0
        websocket.close()
        raise GameOverException()



async def send_to_others(sender, message):
    for client in clients:
        if sender in client:
            if client[0] != sender:
                await client[0].send(message)
            elif client[1] != sender:
                await client[1].send(message)

async def first_move_assigner(sender):
    global connected_users
    connected_users+=1
    if connected_users == 1:
        connected_users+=1
            # print("First move function called ...",first_move)
            # first_move = True
        return True 
    else:
            # first_move = False
        return False

async def handle_message(websocket, path):
    # global clients
    # global first_client
    # global second_client
    # global fastest_time
    # global whose_move
    try:
        await add_clients(websocket)
        if await first_move_assigner(websocket):
            await websocket.send('your_move')
        else:
            await websocket.send('second_move')
        # await first_move_assigner(websocket)
        message = await websocket.recv()
        print("Client has made a move - ",message)
        await check_won(websocket,message)
        await send_to_others(websocket, message)

        message = await websocket.recv()
        print("Client has made a move - ",message)
        await check_won(websocket,message)
        await send_to_others(websocket, message)

        message = await websocket.recv()    
        print("Client has made a move - ",message)
        await check_won(websocket,message)
        await send_to_others(websocket, message)

        message = await websocket.recv()
        print("Client has made a move - ",message)
        await check_won(websocket,message)
        await send_to_others(websocket, message)

        message = await websocket.recv()
        print("Client has made a move - ",message)
        await check_won(websocket,message)
        await send_to_others(websocket, message)
    except websockets.exceptions.ConnectionClosedError:
        print("The function has been called...1")
        message = "client_disconnected"
        send_to_others(websocket,message)
    except GameOverException:
        print("The game is over.")
    except Exception as e:
        print("The error is ",e)
        await send_to_others(websocket,"client_disconnected")
    # while total_moves < 9:
        
    #     client_move = message
    #     # await send_to_others(websocket,message)
    #     print("Client has made a move - ",message)
    #     await send_to_others(websocket, message)
    #     # await websocket.send("upper-middle-button")
            

async def start_server():
    async with websockets.serve(handle_message, "localhost", 8865):
        print("websocket server started ")
        await asyncio.Future()

asyncio.run(start_server())


# def check_if_won(user):
#     for condition in winningMoves:
#         block = 0
#         opacity_change_block = []
#         for every_condition in condition:
#             if ()



