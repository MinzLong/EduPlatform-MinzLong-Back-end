<template>
  <div>
    <div class="mb-3">
      <input v-model="searchQuery" class="form-control" placeholder="Search courses...">
    </div>
    <div class="row">
      <div v-for="course in filteredCourses" :key="course.id" class="col-md-4 mb-3">
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title">{{ course.title }}</h5>
            <p class="card-text">{{ course.description }}</p>
            <router-link :to="{ name: 'CourseDetails', params: { title: course.title } }" class="btn btn-primary">View Details</router-link>
                <span v-if="isCompleted(course.id)" class="completed-badge">✔ Completed</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';

export default {
  setup() {
    const store = useStore();
    const searchQuery = ref('');

    const featuredCourses = ref([
      { id: '1', title: 'VueJS Basics', description: 'Learn the basics of VueJS.', details: 'This course covers the basics of VueJS, including its core concepts and syntax. It is suitable for beginners.', tasks: [{ title: 'Introduction to VueJS', description: 'An overview of VueJS and its core concepts.', type: 'video', content: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' }, { title: 'Getting Started with VueJS', description: 'Setting up your first VueJS project.', type: 'text', content: 'To get started with VueJS, you need to set up your development environment...' }, { title: 'VueJS Basics Quiz', description: 'Test your knowledge of VueJS basics.', type: 'quiz', content: { questions: [{ question: 'What is VueJS?', answers: ['A JavaScript framework', 'A CSS framework', 'A programming language'] }, { question: 'How do you create a Vue instance?', answers: ['new Vue()', 'create Vue()', 'Vue.create()'] }] } }] },
      { id: '2', title: 'Advanced VueJS', description: 'Master advanced concepts of VueJS.', details: 'This course dives into advanced VueJS concepts such as state management, routing, and Vuex.', tasks: [{ title: 'Advanced Vue Techniques', description: 'Deep dive into advanced VueJS techniques.', type: 'video', content: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4' }, { title: 'State Management with Vuex', description: 'Learn how to manage state with Vuex.', type: 'text', content: 'Vuex is a state management pattern + library for Vue.js applications...' }, { title: 'Advanced VueJS Quiz', description: 'Test your knowledge of advanced VueJS concepts.', type: 'quiz', content: { questions: [{ question: 'What is Vuex?', answers: ['A state management library', 'A routing library', 'A CSS framework'] }, { question: 'What is the main purpose of Vue Router?', answers: ['To manage state', 'To handle HTTP requests', 'To manage application routing'] }] } }] },
      { id: '3', title: 'JavaScript Essentials', description: 'Learn the fundamentals of JavaScript.', details: 'This course covers the basics of JavaScript, including variables, functions, and control structures.', tasks: [{ title: 'Introduction to JavaScript', description: 'An overview of JavaScript and its core concepts.', type: 'video', content: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4' }, { title: 'JavaScript Variables and Data Types', description: 'Learn about variables and data types in JavaScript.', type: 'text', content: 'JavaScript variables are used to store data values. In this section, we will learn about different data types...' }, { title: 'JavaScript Basics Quiz', description: 'Test your knowledge of JavaScript basics.', type: 'quiz', content: { questions: [{ question: 'What is a variable in JavaScript?', answers: ['A storage location', 'A type of function', 'A CSS selector'] }, { question: 'How do you declare a variable in JavaScript?', answers: ['var', 'def', 'let'] }] } }] },
      { id: '4', title: 'Full-Stack Development', description: 'Become a full-stack developer.', details: 'This course covers both front-end and back-end development skills needed to become a full-stack developer.', tasks: [{ title: 'Introduction to Full-Stack Development', description: 'An overview of full-stack development and required skills.', type: 'video', content: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' }, { title: 'Front-End Technologies', description: 'Learn about front-end technologies like HTML, CSS, and JavaScript.', type: 'text', content: 'Front-end development involves creating the user interface and user experience aspects of web applications...' }, { title: 'Full-Stack Development Quiz', description: 'Test your knowledge of full-stack development.', type: 'quiz', content: { questions: [{ question: 'What is full-stack development?', answers: ['Developing both client and server software', 'Only front-end development', 'Only back-end development'] }, { question: 'Which of the following is a front-end technology?', answers: ['HTML', 'Node.js', 'Express.js'] }] } }] },
    ]);

    const specialCourses = ref([
      { id: '5', title: 'Exclusive VueJS Tips', description: 'Learn exclusive tips and tricks in VueJS.', details: 'This course provides exclusive insights and advanced techniques in VueJS.', tasks: [{ title: 'Exclusive Tips', description: 'Learn exclusive tips and tricks in VueJS.', type: 'video', content: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4' }, { title: 'Advanced Tips', description: 'Advanced tips for mastering VueJS.', type: 'text', content: 'In this section, we will go through some advanced tips for mastering VueJS...' }, { title: 'VueJS Tips Quiz', description: 'Test your knowledge of VueJS tips.', type: 'quiz', content: { questions: [{ question: 'What is a VueJS tip?', answers: ['An advanced concept', 'A basic concept', 'A tool for state management'] }, { question: 'How can you optimize your VueJS app?', answers: ['Using computed properties', 'Ignoring Vue lifecycle hooks', 'Avoiding Vue Router'] }] } }] },
      { id: '6', title: 'Advanced JavaScript Techniques', description: 'Master advanced JavaScript techniques.', details: 'This course dives into advanced JavaScript topics such as closures, async/await, and ES6 features.', tasks: [{ title: 'Understanding Closures', description: 'Deep dive into closures in JavaScript.', type: 'video', content: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4' }, { title: 'Async/Await in JavaScript', description: 'Learn about asynchronous programming with async/await.', type: 'text', content: 'Async/await makes it easier to write promises in a way that looks synchronous. In this section, we will explore how to use async/await...' }, { title: 'Advanced JavaScript Quiz', description: 'Test your knowledge of advanced JavaScript techniques.', type: 'quiz', content: { questions: [{ question: 'What is a closure in JavaScript?', answers: ['A function with preserved data', 'A loop', 'A condition statement'] }, { question: 'What does async/await help with?', answers: ['Handling asynchronous operations', 'Creating variables', 'Styling elements'] }] } }] },
      { id: '7', title: 'Node.js Fundamentals', description: 'Learn the fundamentals of Node.js.', details: 'This course covers the basics of Node.js, including setting up a server, routing, and middleware.', tasks: [{ title: 'Introduction to Node.js', description: 'An overview of Node.js and its core concepts.', type: 'video', content: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4' }, { title: 'Setting Up a Node.js Server', description: 'Learn how to set up a server with Node.js.', type: 'text', content: 'Node.js allows you to run JavaScript on the server side. In this section, we will learn how to set up a basic server...' }, { title: 'Node.js Basics Quiz', description: 'Test your knowledge of Node.js basics.', type: 'quiz', content: { questions: [{ question: 'What is Node.js?', answers: ['JavaScript runtime built on Chrome\'s V8', 'A database', 'A CSS framework'] }, { question: 'How do you create a server in Node.js?', answers: ['Using the http module', 'Using the fs module', 'Using the express module'] }] } }] },
    ]);

    const filteredCourses = computed(() => {
      const allCourses = store.state.isAuthenticated
        ? [...featuredCourses.value, ...specialCourses.value]
        : featuredCourses.value;

      return allCourses.filter(course => {
        return course.title.toLowerCase().includes(searchQuery.value.toLowerCase());
      });
    });

    const isCompleted = (courseId) => {
      return store.state.completedCourses.includes(courseId);
    };

    onMounted(() => {
      if (store.state.isAuthenticated) {
        store.dispatch('fetchCompletedCourses');
      }
    });

    return { searchQuery, filteredCourses, isCompleted };
  }
};
</script>

<style scoped>
.card {
  margin-bottom: 1rem;
}

.card-title {
  font-size: 1.25rem;
  margin-bottom: 0.75rem;
}

.card-text {
  font-size: 1rem;
  margin-bottom: 1.25rem;
}

.btn-primary {
  background-color: #007bff;
  border-color: #007bff;
}

.btn-primary:hover {
  background-color: #0056b3;
  border-color: #0056b3;
}

.completed-badge {
  display: inline-block;
  margin-top: 10px;
  margin-left: 20px;
  padding: 8px 10px;
  background-color: #28a745;
  color: white;
  border-radius: 5px;
  font-size: 0.9rem;
}
</style>
