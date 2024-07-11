<template>
  <div v-if="course">
    <div class="mb-4">
      <h2>{{ course.title }}</h2>
      <p>{{ course.description }}</p>
      <p>{{ course.details }}</p>
    </div>
    <div class="mb-4">
      <h4>Course Content</h4>
      <div class="accordion" id="courseContent">
        <div class="accordion-item" v-for="(task, index) in course.tasks" :key="index">
          <h2 class="accordion-header" :id="'heading' + index">
            <button class="accordion-button" type="button" data-bs-toggle="collapse" :data-bs-target="'#collapse' + index" aria-expanded="true" :aria-controls="'collapse' + index">
              {{ task.title }}
            </button>
          </h2>
          <div :id="'collapse' + index" class="accordion-collapse collapse" :aria-labelledby="'heading' + index" data-bs-parent="#courseContent">
            <div class="accordion-body">
              <p>{{ task.description }}</p>
              <div v-if="task.type === 'video'">
                <video :src="task.content" controls class="w-100"></video>
              </div>
              <div v-if="task.type === 'text'">
                <p>{{ task.content }}</p>
              </div>
              <div v-if="task.type === 'quiz'">
                <h5>Quiz</h5>
                <ul class="list-group">
                  <li class="list-group-item" v-for="(question, qIndex) in task.content.questions" :key="qIndex">
                    <p>{{ question.question }}</p>
                    <div v-for="(answer, aIndex) in question.answers" :key="aIndex">
                      <input type="radio" :name="'question' + qIndex" :value="answer" :id="'question' + qIndex + 'answer' + aIndex">
                      <label :for="'question' + qIndex + 'answer' + aIndex">{{ answer }}</label>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div>
      <button v-if="isAuthenticated && !isCompleted" @click="markAsCompleted" class="btn btn-primary">Mark as Completed</button>
      <span v-else-if="isCompleted" class="badge bg-success">Completed</span>
    </div>
    <router-link class="btn btn-secondary mt-3" to="/courses">Back to Courses</router-link>
  </div>
  <div v-else>
    <p>Course not found</p>
    <router-link class="btn btn-secondary" to="/courses">Back to Courses</router-link>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';

export default {
  props: ['title'],
  setup(props) {
    const store = useStore();
    const router = useRouter();
    const courses = ref([
      { id: '1', title: 'VueJS Basics', description: 'Learn the basics of VueJS.', details: 'This course covers the basics of VueJS, including its core concepts and syntax. It is suitable for beginners.', tasks: [{ title: 'Introduction to VueJS', description: 'An overview of VueJS and its core concepts.', type: 'video', content: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' }, { title: 'Getting Started with VueJS', description: 'Setting up your first VueJS project.', type: 'text', content: 'To get started with VueJS, you need to set up your development environment...' }, { title: 'VueJS Basics Quiz', description: 'Test your knowledge of VueJS basics.', type: 'quiz', content: { questions: [{ question: 'What is VueJS?', answers: ['A JavaScript framework', 'A CSS framework', 'A programming language'] }, { question: 'How do you create a Vue instance?', answers: ['new Vue()', 'create Vue()', 'Vue.create()'] }] } }] },
      { id: '2', title: 'Advanced VueJS', description: 'Master advanced concepts of VueJS.', details: 'This course dives into advanced VueJS concepts such as state management, routing, and Vuex.', tasks: [{ title: 'Advanced Vue Techniques', description: 'Deep dive into advanced VueJS techniques.', type: 'video', content: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4' }, { title: 'State Management with Vuex', description: 'Learn how to manage state with Vuex.', type: 'text', content: 'Vuex is a state management pattern + library for Vue.js applications...' }, { title: 'Advanced VueJS Quiz', description: 'Test your knowledge of advanced VueJS concepts.', type: 'quiz', content: { questions: [{ question: 'What is Vuex?', answers: ['A state management library', 'A routing library', 'A CSS framework'] }, { question: 'What is the main purpose of Vue Router?', answers: ['To manage state', 'To handle HTTP requests', 'To manage application routing'] }] } }] },
      { id: '3', title: 'JavaScript Essentials', description: 'Learn the fundamentals of JavaScript.', details: 'This course covers the basics of JavaScript, including variables, functions, and control structures.', tasks: [{ title: 'Introduction to JavaScript', description: 'An overview of JavaScript and its core concepts.', type: 'video', content: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4' }, { title: 'JavaScript Variables and Data Types', description: 'Learn about variables and data types in JavaScript.', type: 'text', content: 'JavaScript variables are used to store data values. In this section, we will learn about different data types...' }, { title: 'JavaScript Basics Quiz', description: 'Test your knowledge of JavaScript basics.', type: 'quiz', content: { questions: [{ question: 'What is a variable in JavaScript?', answers: ['A storage location', 'A type of function', 'A CSS selector'] }, { question: 'How do you declare a variable in JavaScript?', answers: ['var', 'def', 'let'] }] } }] },
      { id: '4', title: 'Full-Stack Development', description: 'Become a full-stack developer.', details: 'This course covers both front-end and back-end development skills needed to become a full-stack developer.', tasks: [{ title: 'Introduction to Full-Stack Development', description: 'An overview of full-stack development and required skills.', type: 'video', content: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' }, { title: 'Front-End Technologies', description: 'Learn about front-end technologies like HTML, CSS, and JavaScript.', type: 'text', content: 'Front-end development involves creating the user interface and user experience aspects of web applications...' }, { title: 'Full-Stack Development Quiz', description: 'Test your knowledge of full-stack development.', type: 'quiz', content: { questions: [{ question: 'What is full-stack development?', answers: ['Developing both client and server software', 'Only front-end development', 'Only back-end development'] }, { question: 'Which of the following is a front-end technology?', answers: ['HTML', 'Node.js', 'Express.js'] }] } }] },
      { id: '5', title: 'Exclusive VueJS Tips', description: 'Learn exclusive tips and tricks in VueJS.', details: 'This course provides exclusive insights and advanced techniques in VueJS.', tasks: [{ title: 'Exclusive Tips', description: 'Learn exclusive tips and tricks in VueJS.', type: 'video', content: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4' }, { title: 'Advanced Tips', description: 'Advanced tips for mastering VueJS.', type: 'text', content: 'In this section, we will go through some advanced tips for mastering VueJS...' }, { title: 'VueJS Tips Quiz', description: 'Test your knowledge of VueJS tips.', type: 'quiz', content: { questions: [{ question: 'What is a VueJS tip?', answers: ['An advanced concept', 'A basic concept', 'A tool for state management'] }, { question: 'How can you optimize your VueJS app?', answers: ['Using computed properties', 'Ignoring Vue lifecycle hooks', 'Avoiding Vue Router'] }] } }] },
      { id: '6', title: 'Advanced JavaScript Techniques', description: 'Master advanced JavaScript techniques.', details: 'This course dives into advanced JavaScript topics such as closures, async/await, and ES6 features.', tasks: [{ title: 'Understanding Closures', description: 'Deep dive into closures in JavaScript.', type: 'video', content: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4' }, { title: 'Async/Await in JavaScript', description: 'Learn about asynchronous programming with async/await.', type: 'text', content: 'Async/await makes it easier to write promises in a way that looks synchronous. In this section, we will explore how to use async/await...' }, { title: 'Advanced JavaScript Quiz', description: 'Test your knowledge of advanced JavaScript techniques.', type: 'quiz', content: { questions: [{ question: 'What is a closure in JavaScript?', answers: ['A function with preserved data', 'A loop', 'A condition statement'] }, { question: 'What does async/await help with?', answers: ['Handling asynchronous operations', 'Creating variables', 'Styling elements'] }] } }] },
      { id: '7', title: 'Node.js Fundamentals', description: 'Learn the fundamentals of Node.js.', details: 'This course covers the basics of Node.js, including setting up a server, routing, and middleware.', tasks: [{ title: 'Introduction to Node.js', description: 'An overview of Node.js and its core concepts.', type: 'video', content: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4' }, { title: 'Setting Up a Node.js Server', description: 'Learn how to set up a server with Node.js.', type: 'text', content: 'Node.js allows you to run JavaScript on the server side. In this section, we will learn how to set up a basic server...' }, { title: 'Node.js Basics Quiz', description: 'Test your knowledge of Node.js basics.', type: 'quiz', content: { questions: [{ question: 'What is Node.js?', answers: ['JavaScript runtime built on Chrome\'s V8', 'A database', 'A CSS framework'] }, { question: 'How do you create a server in Node.js?', answers: ['Using the http module', 'Using the fs module', 'Using the express module'] }] } }] },
    ]);

    const course = computed(() => {
      return courses.value.find(course => course.title.toLowerCase() === props.title.toLowerCase());
    });

    const isCompleted = computed(() => {
      if (!course.value) return false;
      return store.state.completedCourses.includes(course.value.id.toString());
    });

    const isAuthenticated = computed(() => store.state.isAuthenticated);

    const markAsCompleted = async () => {
      if (!isAuthenticated.value) {
        router.push('/login');
        return;
      }
      if (course.value) {
        await store.dispatch('markCourseAsCompleted', course.value.id.toString());
        router.push('/courses');
      }
    };

    onMounted(() => {
      if (store.state.isAuthenticated) {
        store.dispatch('fetchCompletedCourses');
      }
    });

    return { course, isCompleted, isAuthenticated, markAsCompleted };
  }
};
</script>

<style scoped>
.course {
  margin: 10px 0;
}

.accordion-item {
  margin-bottom: 1rem;
}

.accordion-button {
  cursor: pointer;
}

.accordion-body video {
  width: 100%;
}

.accordion-body p {
  margin: 0;
}

.badge.bg-success {
  background-color: #28a745;
  border-color: #28a745;
  font-size: 1rem;
  padding: 0.5rem;
  display: inline-block;
  margin-top: 1rem;
}
</style>

