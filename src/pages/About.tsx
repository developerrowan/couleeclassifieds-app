import { useEffect } from 'react';
import { setPageTitle } from '../services/auth.service';

export default function About() {
  useEffect(() => {
    setPageTitle('About');
  }, []);

  return (
    <>
      <div className="container-fluid">
        <h1 className="text-center">About Us</h1>
        <p className="text-center">Coulee Classifieds is the best place to find your new career!</p>
      </div>
    </>
  );
}
