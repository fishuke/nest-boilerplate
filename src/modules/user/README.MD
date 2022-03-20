## TRICK HERE

Normally you need to pay to an otp service to verify user's phone number. 
But I found a way that I can log in users client side with firebase then I can send user's uid to the backend. 
I verify if the id is registered and the phone number matches with DTO.
In this way we register users with phone number verified.

So smart right? But lil tricky.

Having firebase connection will let users log in with other ways in the future.
But we will have the user base in our database, so we are ready to exit firebase any time.
It costs a lot in big projects. So it's better to maintain it ourselves.
