const app = Vue.createApp({})

app.component('voter', {
  props: ['voted', 'votes', 'userId', 'postId'],
  setup(props) {
    const voted = Vue.ref(props.voted)
    const baseVotes = Vue.ref(props.votes - voted.value)
    const votes = Vue.computed(() => baseVotes.value + voted.value)
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
      handleClick,
    }
  },
  template: `
      <div style="display: flex; align-items: center">
        <div class="triangle up" :class="voted === 1 && 'voted'" @click="handleClick(1)"></div>
        <div style="flex: 0 1 20px; text-align:center; margin: 0 8px;">{{ votes }}</div>
        <div class="triangle down" :class="voted === -1 && 'voted'" @click="handleClick(-1)"></div>
      </div>
    `,
})

app.component('comment', {
  setup() {
    return {}
  },
  template: ``,
})

app.mount('#app')
