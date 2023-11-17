import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import '@/style/global.less';
import '@/style/reset.css';
import microApp from '@micro-zoe/micro-app';

microApp.start({
  lifeCycles: {
    created(e) {
      console.log('created');
      console.log(e);
    },
    beforemount() {
      console.log('beforemount');
    }
  }
});

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <App />
);
