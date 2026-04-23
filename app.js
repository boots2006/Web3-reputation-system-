import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const supabase = createClient(
  "https://ykqxpfcseuybgawbonyb.supabase.co",
  "sb_publishable_nY9p1a2Wqw7Dv-ChfamsHw_wMyL_97E"
)

// AUTH
window.register = async () => {
  const email = document.getElementById("email").value
  const password = document.getElementById("password").value

  const { data, error } = await supabase.auth.signUp({
    email,
    password
  })

  if (!error) {
    await supabase.from("users").insert([
      { email, score: 0 }
    ])
  }
}

window.login = async () => {
  const email = document.getElementById("email").value
  const password = document.getElementById("password").value

  await supabase.auth.signInWithPassword({
    email,
    password
  })
}

window.logout = async () => {
  await supabase.auth.signOut()
}

// POST
window.addPost = async () => {
  const text = document.getElementById("postInput").value

  const { data: userData } = await supabase.auth.getUser()
  if (!userData.user) return alert("Login first")

  await supabase.from("posts").insert([
    {
      text,
      user_email: userData.user.email,
      likes: 0
    }
  ])

  // +5 points
  await supabase.rpc("increment_score", {
    user_email_input: userData.user.email,
    value: 5
  })
}

// LIKE
window.likePost = async (id, email) => {
  await supabase.rpc("like_post", {
    post_id: id
  })

  await supabase.rpc("increment_score", {
    user_email_input: email,
    value: 2
  })
}

// LOAD POSTS
async function loadPosts() {
  const { data } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false })

  const feed = document.getElementById("feed")
  feed.innerHTML = ""

  data.forEach(post => {
    feed.innerHTML += `
      <div class="post">
        <b>${post.user_email}</b>
        <p>${post.text}</p>
        <button onclick="likePost('${post.id}','${post.user_email}')">
          ❤️ ${post.likes}
        </button>
      </div>
    `
  })
}

// LEADERBOARD
async function loadLeaderboard() {
  const { data } = await supabase
    .from("users")
    .select("*")
    .order("score", { ascending: false })

  const board = document.getElementById("leaderboard")
  board.innerHTML = ""

  data.forEach(user => {
    board.innerHTML += `
      <div class="leader">
        ${user.email} — ${user.score} pts
      </div>
    `
  })
}

// REFRESH LOOP
setInterval(() => {
  loadPosts()
  loadLeaderboard()
}, 2000)
