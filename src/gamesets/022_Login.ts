const apiUrl =
  "https://script.google.com/macros/s/AKfycbyVgq9boRy9J0bMhxKAyDfkPXryA45m7tOigWeRBkVAxQmyzsogxPWEv5mf8TtprdR8/exec";

export async function checkUsername(username: string): Promise<number> {
  const url = `${apiUrl}?action=checkUsername&username=${encodeURIComponent(
    username
  )}`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

export async function checkPassword(
  id: number,
  password: string
): Promise<boolean> {
  const url = `${apiUrl}?action=checkPassword&id=${id}&password=${encodeURIComponent(
    password
  )}`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

export async function createUser(
  username: string,
  password: string
): Promise<number> {
  const url = `${apiUrl}?action=createUser&username=${encodeURIComponent(
    username
  )}&password=${encodeURIComponent(password)}`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

/*
(async () => {
  const username = "exampleUser";
  const password = "examplePass";

  // Check if the username exists
  const id = await checkUsername(username);
  if (id === -1) {
    console.log("Username not found. Creating new user...");
    const newId = await createUser(username, password);
    console.log("New user created with ID:", newId);
  } else {
    console.log("User found with ID:", id);
    const isValid = await checkPassword(id, password);
    if (isValid) {
      console.log("Password is correct.");
    } else {
      console.log("Incorrect password.");
    }
  }
})();
*/
