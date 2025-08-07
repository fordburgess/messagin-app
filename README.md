<h1>Legora Fullstack coding challenge</h1>
<h2>Messaging App</h2>

<h3>Intro</h3>
<p>This is a fullstack messaging app, built in a monorepo structure to accomadate for the trpc based backend. The frontend is built using Vite + React/Typescript.</p>
<p>The used is a PostgresSQL database hosted remotely on Render.</p>

<h3>Notes</h3>
<p><strong>NO ENV VARIABLES</strong> - Since I was not asked to host this app anywhere, I did not use any env variables, because when other users would not have access to these variables after cloning this project.</p>
<p>All values that normally would be secret are statically in the codebase. I suppose I could have included an .env file, removed it from the .gitignore and uploaded it to the remote repo here, but oh well.</p>

<h3>Setup</h3>
<p>To run this app:</p>
<p> 1. clone the app</p>
<p> 2. cd into the root</p>
<p> 3. run <code>npm install</code>and then run <code>npm run dev</code>.</p>
<p>This repo makes use of the 'concurrently' package, which allows us to run both the server and the frontend at the same time. Afterwards, go to your browser at <code>localhost:5173</code>. You should see a login screen.</p>

<h3>Usage</h3>
<p>The database has already been seeded with 20 users. Below is a list of all the users in the database. Please login as one of these users:</p>

  | ID | Name              | Username                   | Password          |
  |----|-------------------|----------------------------|-------------------|
  | 1  | Layla Ahmed       | ahmed.layla@gmail.com       | test_password_1   |
  | 2  | Omar Hussein      | omar.hussein@example.com    | test_password_2   |
  | 3  | Sara Ibrahim      | sara.ibrahim@example.com    | test_password_3   |
  | 4  | Noah Johnson      | noah.johnson@example.com    | test_password_4   |
  | 5  | Maya Patel        | maya.patel@example.com      | test_password_5   |
  | 6  | Ali Khan          | ali.khan@example.com        | test_password_6   |
  | 7  | Zara Lee          | zara.lee@example.com        | test_password_7   |
  | 8  | Ethan Kim         | ethan.kim@example.com       | test_password_8   |
  | 9  | Chloe Nguyen      | chloe.nguyen@example.com    | test_password_9   |
  | 10 | Lucas Wang        | lucas.wang@example.com      | test_password_10  |
  | 11 | Ava Garcia        | ava.garcia@example.com      | test_password_11  |
  | 12 | Daniel Smith      | daniel.smith@example.com    | test_password_12  |
  | 13 | Lily Chen         | lily.chen@example.com       | test_password_13  |
  | 14 | Mohammed Ali      | mohammed.ali@example.com    | test_password_14  |
  | 15 | Sophia Park       | sophia.park@example.com     | test_password_15  |
  | 16 | Elijah Brown      | elijah.brown@example.com    | test_password_16  |
  | 17 | Isabella Rivera   | isabella.rivera@example.com | test_password_17  |
  | 18 | Henry Adams       | henry.adams@example.com     | test_password_18  |
  | 19 | Grace Lopez       | grace.lopez@example.com     | test_password_19  |
  | 20 | Leo Wilson        | leo.wilson@example.com      | test_password_20  |

<p>
  After you login as one of these users, depending the database seeds, you may see a few chats and messages already. Otherwise, click the plus button at the top of the lefthand
  column and select another user and start a new chat.
</p>

<h3>To Do +</h3>
<p>A list of improvements I would make if I had more time to work on this:</p>
<ul>
  <li>
    <h4>Refactor Frontend</h4>
    <p>The styling and component structure could be more organized. I'd separate concerns more cleanly and apply a consistent styling convention.</p>
  </li>
  <li>
    <h4>More organized type safety system</h4>
    <p>Due to time constraints, the app doesn’t fully leverage tRPC's type-safe features. With more time, I’d refactor types and schemas for stricter contracts and better developer experience.</p>
  </li>
  <li>
    <h4>Unread message badge</h4>
    <p>In the lefthand column that lists all the user's chats, I would add a badge on a chat that contains unread messages, with the number of unread messages</p>
  </li>
  <li>
    <h4>Respond to specific messages</h4>
    <p>
      I would add a feature that allows users to respond to specific messages. Off the top of my head, I would do this by adding a <code>responding_to</code> column in the
      <code>messages</code> table in the db and creating a foreign key relationship with the <code>id</code> column. On the client side, I would have a state variable
      like <code>const [respondingTo, setRespondingTo] = useState<number | null>(null)</code> in the <code><ChatInterface /></code> component, which would be passed down to the
      <code><CreateMessage /></code> component and then sent off with the rest of the message data when a new message is created. Now the message that is being responded to is always
      with the main message, so when rendering each message, we can check in the global state for the message being responded to, and then display with next to/above the responding message.
    </p>
  </li>
  <li>
    <h4>Group Messages</h4>
    <p>Relatively simple to do, wouldn't take long to implement</p>
  </li>  
</ul>
