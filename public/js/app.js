const app = Vue.createApp({})

app.component('voter', {
  props: ['voted', 'votes', 'userId', 'postId'],
  setup(props) {
    const voted = Vue.ref(props.voted)
    const baseVotes = Vue.ref(props.votes - voted.value)
    const votes = Vue.computed(() => baseVotes.value + voted.value)
    const votesClass = Vue.computed(() => {
      if (voted.value === 1) {
        return 'upvoted'
      } else if (voted.value === -1) {
        return 'downvoted'
      } else {
        return ''
      }
    })
    const handleClick = function (setvoteto) {
      if (!props.userId) {
        window.location.href = '/auth/login'
      }

      fetch(`/posts/vote/${props.postId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ setvoteto }),
      }).then(() => (voted.value = voted.value === setvoteto ? 0 : setvoteto))
    }
    return {
      voted,
      votes,
      votesClass,
      handleClick,
    }
  },
  template: `
      <div style="display: flex; align-items: center">
        <div class="triangle up" :class="voted === 1 && 'voted'" @click="handleClick(1)"></div>
        <div class="votes" :class="votesClass">{{ votes }}</div>
        <div class="triangle down" :class="voted === -1 && 'voted'" @click="handleClick(-1)"></div>
      </div>
    `,
})

app.component('comment', {
  props: ['comment', 'userId'],
  setup(props, { emit }) {
    const showReply = Vue.ref(false)
    const showEdit = Vue.ref(false)

    const toggleReply = function () {
      showReply.value = !showReply.value
    }

    const toggleEdit = function () {
      showEdit.value = !showEdit.value
      if (showEdit.value) {
        showReply.value = false
      }
      console.log(showEdit.value, showReply.value)
    }

    const repliesOrderByDate = Vue.computed(() => {
      return props.comment.replies.sort((a, b) => a.timestamp - b.timestamp)
    })

    const addReply = function (reply) {
      props.comment.replies.push(reply)
      toggleReply()
    }

    const deleteComment = function () {
      const res = confirm('Are you sure you want to delete this comment?')
      if (res) {
        const url = `/comments/delete/${props.comment.id}`
        fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        }).then(() => {
          emit('delete', props.comment.id)
        })
      }
    }

    const editComment = function (description) {
      const url = `/comments/edit/${props.comment.id}`
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description }),
      }).then(() => {
        props.comment.description = description
        toggleEdit()
      })
    }

    const deleteReply = function (replyId) {
      props.comment.replies = props.comment.replies.filter((reply) => reply.id !== replyId)
    }

    return {
      repliesOrderByDate,
      showReply,
      showEdit,
      toggleReply,
      addReply,
      deleteComment,
      editComment,
      deleteReply,
      toggleEdit,
    }
  },
  template: `
    <div class="comment">
      <div style="font-size: 16px">
        <span>{{ comment.creator.uname }}</span>
        <span style="opacity: 0.5; margin-left: 20px">{{ new Date(comment.timestamp).toLocaleString("en-US") }}</span>
      </div>
      <div class="comment-body">
        <div>{{ comment.description }}</div>
        <div class="comment-footer" v-if="userId">
          <div role="button" class="secondary sm-btn" @click="toggleReply">
            {{ showReply ? 'Cancel' : 'Reply' }}
          </div>
          <div style="flex: 1"></div>
          <template v-if="comment.creator.id === userId">
            <div role="button" class="secondary sm-btn" style="margin-right: 16px" @click="toggleEdit">
              {{ showEdit ? 'Cancel' : 'Edit' }}
            </div>          
            <div role="button" class="secondary sm-btn" @click="deleteComment">Delete</div>
          </template>
        </div>
        <edit-comment v-if="showEdit" :content="comment.description" @submit="editComment" />
        <add-comment v-if="showReply" :post-id="comment.post_id" :reply="comment.id" @add-comment="addReply" />
        <comment v-for="item in repliesOrderByDate" :key="item.id" :comment="item" :user-id="userId" @delete="deleteReply" />
      </div>
    </div>
    `,
})

app.component('edit-comment', {
  props: ['content'],
  emits: ['submit'],
  setup(props, context) {
    const comment = Vue.ref(props.content)
    const handleClick = function () {
      context.emit('submit', comment.value)
    }
    return {
      comment,
      handleClick,
    }
  },
  template: `
    <div>
      <textarea
        rows="3" 
        style="margin-top: 16px;"
        v-model="comment"
      ></textarea>
      <button type="button" class="primary" @click="handleClick">Submit Change</button>
    </div>
    `,
})

app.component('add-comment', {
  props: ['postId', 'reply'],
  emits: ['add-comment'],
  setup(props, context) {
    const comment = Vue.ref('')
    const handleClick = function () {
      const url = `/comments/create/${props.postId}`
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ comment: comment.value, reply: props.reply }),
      })
        .then((res) => res.json())
        .then((data) => {
          comment.value = ''
          context.emit('add-comment', data)
        })
    }
    return {
      comment,
      handleClick,
    }
  },
  template: `
    <textarea 
      rows="3" 
      style="margin-top: 16px;"
      placeholder="Say something..." 
      v-model="comment"
    ></textarea>
    <button type="button" class="primary" @click="handleClick">{{reply ? 'Reply' : 'Comment'}}</button>`,
})

app.component('comment-list', {
  props: ['postId', 'userId'],
  setup(props) {
    const comments = Vue.ref([])

    const byDates = Vue.computed(() => {
      return comments.value.sort((a, b) => a.timestamp - b.timestamp)
    })

    Vue.onMounted(() => {
      fetch(`/comments/list/${props.postId}`)
        .then((res) => res.json())
        .then((data) => (comments.value = data))
    })

    const addComment = function (comment) {
      comments.value.push(comment)
    }

    const deleteComment = function (commentId) {
      comments.value = comments.value.filter((comment) => comment.id !== commentId)
    }

    return {
      comments,
      byDates,
      addComment,
      deleteComment,
    }
  },

  template: `
    <div class="comment-list">
      <add-comment :post-id="postId" v-if="userId" @add-comment="addComment" />
      <p>{{ comments.length }} comments</p>
      <comment 
        v-for="comment in byDates" 
        :key="comment.id" 
        :comment="comment" 
        :user-id="userId" 
        @delete="deleteComment" 
      />
    </div>
  `,
})

app.mount('#app')
