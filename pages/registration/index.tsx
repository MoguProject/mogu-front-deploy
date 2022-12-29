import Layout from '../../components/Layout';
import type { NextPage } from 'next';
import Registration from '../../components/registration';
import { useForm } from 'react-hook-form';

const RegistrationPage: NextPage = () => {
  const { register, handleSubmit } = useForm();

  return (
    <Layout>
      <Registration register={register} />
    </Layout>
  );
};

export default RegistrationPage;
