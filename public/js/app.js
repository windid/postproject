const Voter = {
  props: ['voted', 'votes', 'userId', 'postId'],
  setup(props) {
    const voted = Vue.ref(props.voted)
    const votes = Vue.ref(props.votes)
    const handleClick = function (dir) {
      if (!props.userId) {
        window.location.href = '/auth/login'
      }

      const url = `/posts/vote/${props.postId}`
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dir }),
      }).then(() => {
        const newValue = dir === 'up' ? 1 : -1
        if (voted.value === newValue) {
          voted.value = '0'
          votes.value -= newValue
        } else {
          votes.value += newValue - voted.value
          voted.value = newValue
        }
      })
    }
    return {
      voted,
      votes,
      handleClick,
    }
  },
  template: `
      <div style="display: flex; align-items: center">
        <div class="triangle up" :class="voted === 1 && 'voted'" @click="handleClick('up')"></div>
        <div style="flex: 0 1 20px; text-align:center; margin: 0 8px;">{{ votes }}</div>
        <div class="triangle down" :class="voted === -1 && 'voted'" @click="handleClick('down')"></div>
      </div>
    `,
}

const app = Vue.createApp({})
app.component('voter', Voter)
app.mount('#app')
