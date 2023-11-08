import type { Post, PostData, CommentData, VoteData, Comment } from './model'

const users: { [key: number]: Express.User } = {
  1: {
    id: 1,
    uname: 'alice',
    password: 'alpha',
  },
  2: {
    id: 2,
    uname: 'theo',
    password: '123',
  },
  3: {
    id: 3,
    uname: 'prime',
    password: '123',
  },
  4: {
    id: 4,
    uname: 'leerob',
    password: '123',
  },
}

const posts: { [key: number]: PostData } = {
  101: {
    id: 101,
    title: 'Mochido opens its new location in Coquitlam this week',
    link: 'https://dailyhive.com/vancouver/mochido-coquitlam-open',
    description: 'New mochi donut shop, Mochido, is set to open later this week.',
    creator: 1,
    subgroup: 'food',
    timestamp: 1643648446955,
  },
  102: {
    id: 102,
    title: '2023 State of Databases for Serverless & Edge',
    link: 'https://leerob.io/blog/backend',
    description:
      'An overview of databases that pair well with modern application and compute providers.',
    creator: 4,
    subgroup: 'coding',
    timestamp: 1643648446959,
  },
}

const comments: CommentData[] = [
  {
    id: 9001,
    post_id: 102,
    creator: 1,
    description: 'Actually I learned a lot :pepega:',
    timestamp: 1642691742010,
  },
]

const votes: VoteData[] = [
  { user_id: 2, post_id: 101, value: +1 },
  { user_id: 3, post_id: 101, value: +1 },
  { user_id: 4, post_id: 101, value: +1 },
  { user_id: 3, post_id: 102, value: -1 },
]

function debug() {
  console.log('==== DB DEBUGING ====')
  console.log('users', users)
  console.log('posts', posts)
  console.log('comments', comments)
  console.log('votes', votes)
  console.log('==== DB DEBUGING ====')
}

function getUser(id: number): Express.User | undefined {
  return users[id]
}

function getUserByUsername(uname: string) {
  return Object.values(users).find((user) => user.uname === uname)
}

function createUser(uname: string, password: string) {
  const id = Math.max(...Object.keys(users).map(Number)) + 1
  users[id] = { id, uname, password }
  return users[id]
}

function getVotesForPost(post_id: number) {
  return votes.filter((vote) => vote.post_id === post_id)
}

function voteForPost(post_id: number, user_id: number, value: number) {
  const vote = votes.find((vote) => vote.post_id === post_id && vote.user_id === user_id)
  if (vote) {
    if (vote.value === value) {
      votes.splice(votes.indexOf(vote), 1)
    } else {
      vote.value = value
    }
  } else {
    votes.push({ user_id, post_id, value })
  }
}

function decoratePost(post: PostData): Post {
  return {
    ...post,
    creator: users[post.creator],
    votes: getVotesForPost(post.id),
  }
}

/**
 * @param {*} n how many posts to get, defaults to 5
 * @param {*} orderby how to order the posts, defaults to date
 * @param {*} sub which sub to fetch, defaults to all subs
 */
function getPosts(n = 5, orderby?: string, sub?: string) {
  let compareFn: (a: Post, b: Post) => number
  switch (orderby) {
    case 'votes':
      compareFn = (a, b) => {
        const aVotes = a.votes.reduce((acc, vote) => acc + vote.value, 0)
        const bVotes = b.votes.reduce((acc, vote) => acc + vote.value, 0)
        return bVotes - aVotes
      }
      break
    case 'totalVotes':
      compareFn = (a, b) => b.votes.length - a.votes.length
      break
    default: // date
      compareFn = (a, b) => b.timestamp - a.timestamp
  }
  let allPosts = Object.values(posts)
  if (sub) {
    allPosts = allPosts.filter((post) => post.subgroup === sub)
  }
  const res = allPosts.map(decoratePost).sort(compareFn)
  return res.slice(0, n)
}

function getPost(id: number) {
  if (!posts[id]) {
    return null
  }
  return decoratePost(posts[id])
}

function addPost(
  title: string,
  link: string,
  creator: number,
  description: string,
  subgroup: string
): PostData {
  const id = Math.max(...Object.keys(posts).map(Number)) + 1
  const post: PostData = {
    id,
    title,
    link,
    description,
    creator: Number(creator),
    subgroup,
    timestamp: Date.now(),
  }
  posts[id] = post
  return post
}

function editPost(post_id: number, changes: Partial<PostData> = {}) {
  const post = posts[post_id]
  if (changes.title) {
    post.title = changes.title
  }
  if (changes.link) {
    post.link = changes.link
  }
  if (changes.description) {
    post.description = changes.description
  }
  if (changes.subgroup) {
    post.subgroup = changes.subgroup
  }
}

function deletePost(post_id: number) {
  delete posts[post_id]
  // delete comments belonging to this post
  comments
    .filter((comment) => comment.post_id === post_id)
    .forEach((comment) => comments.splice(comments.indexOf(comment), 1))
}

function getSubs() {
  return Array.from(new Set(Object.values(posts).map((post) => post.subgroup))).sort()
}

function addComment(
  post_id: number,
  creator: number,
  description: string,
  reply?: number
): Comment {
  const id = Math.max(...comments.map((c) => c.id)) + 1
  const comment = {
    id,
    post_id,
    creator,
    description,
    reply,
    timestamp: Date.now(),
  }
  comments.push(comment)
  return decorateComment(comment, [])
}

function getComment(comment_id: number) {
  return comments.find((comment) => comment.id === comment_id)
}

function decorateComment(comment: CommentData, comments: CommentData[]): Comment {
  const user = users[comment.creator]
  return {
    ...comment,
    creator: {
      id: user.id,
      uname: user.uname,
    },
    replies: comments
      .filter((c) => c.reply === comment.id)
      .map((c) => decorateComment(c, comments)),
  }
}

function getComments(post_id: number): Comment[] {
  const res = comments.filter((comment) => comment.post_id === post_id)
  return res.filter((comment) => !comment.reply).map((comment) => decorateComment(comment, res))
}

function editComment(comment_id: number, description: string) {
  const comment = comments.find((comment) => comment.id === comment_id)
  if (!comment) {
    return
  }
  comment.description = description
  return comment
}

function deleteComment(comment_id: number) {
  // delete replies
  const deleteReplies = (comment_id: number) => {
    const replies = comments.filter((comment) => comment.reply === comment_id)
    replies.forEach((reply) => {
      deleteReplies(reply.id)
      comments.splice(comments.indexOf(reply), 1)
    })
  }
  deleteReplies(comment_id)
  comments.splice(
    comments.findIndex((comment) => comment.id === comment_id),
    1
  )
}

export {
  debug,
  getUser,
  getUserByUsername,
  createUser,
  getPosts,
  getPost,
  addPost,
  editPost,
  deletePost,
  getSubs,
  addComment,
  getComment,
  getComments,
  editComment,
  deleteComment,
  decoratePost,
  voteForPost,
}
