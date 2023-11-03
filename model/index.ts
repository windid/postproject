export interface PostData {
  id: number
  title: string
  link: string
  description: string
  creator: number
  subgroup: string
  timestamp: number
}

export interface Post extends Omit<PostData, 'creator'> {
  creator: Express.User
  votes: VoteData[]
  comments: Comment[]
}

export interface CommentData {
  id: number
  post_id: number
  creator: number
  description: string
  timestamp: number
}

export interface Comment extends Omit<CommentData, 'creator'> {
  creator: Express.User
}

export interface VoteData {
  user_id: number
  post_id: number
  value: number
}
