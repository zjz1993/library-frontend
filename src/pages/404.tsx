import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, 页面找不到"
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
