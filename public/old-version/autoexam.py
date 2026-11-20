
import random

print("Pirate Dice Arrr! Pick up your glass and roll the dice!")

numMachine = random.randint(1, 6)


#Ask the user to input a number between 1 and 6

#Function to make a roll for both the player and the machine

def rollDice():
    return random.randint(1, 6)

numPlayer = int(input("Enter a number between 1 and 6: "))
numMachine = rollDice()

if numPlayer < numMachine:
    print("You lose! The machine rolled a", numMachine)
elif numPlayer > numMachine:
    print("You win! The machine rolled a", numMachine)
else:
    print("It's a tie! Both rolled a", numMachine)

#Save the result on txt file
with open("result.txt", "w") as file:
    if numPlayer < numMachine:
        file.write(f"You lose! The machine rolled a {numMachine}\n")
    elif numPlayer > numMachine:
        file.write(f"You win! The machine rolled a {numMachine}\n")
    else:
        file.write(f"It's a tie! Both rolled a {numMachine}\n")


