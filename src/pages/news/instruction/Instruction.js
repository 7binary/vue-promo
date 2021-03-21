export default {
  props: ['id'],
  data() {
    return {
      instructionID: this.$props.id,
    };
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    instruction() {
      return this.$store.state.news.instruction;
    },
  },
  methods: {
    setInstructionReaded() {
      const payload = {
        profile_id: this.user.profile_id,
        instruction_id: +this.instructionID,
      };
      this.$store.dispatch('news/SetInstructionReaded', payload);
    },
  },
  created() {
    this.user.profile_id && this.instructionID && this.setInstructionReaded();
  },
};
