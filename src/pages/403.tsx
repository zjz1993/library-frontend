import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <Result
      status="403"
      title="403"
      subTitle="您没有权限访问该页面"
      extra={
        <Button
          type="primary"
          onClick={() => {
            navigate('/');
          }}
        >
          点击返回首页
        </Button>
      }
    />
  );
};
export default NotFound;
