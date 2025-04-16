import React from 'react';
import { Icon } from '@chakra-ui/react';
import {
  MdBarChart,
  MdHome,
  MdOutlineShoppingCart,
  MdSettings,
  MdCategory,
} from 'react-icons/md';

import { TbBrandAdonisJs } from 'react-icons/tb';
import { MdAdminPanelSettings } from 'react-icons/md';
import { TiMinus } from 'react-icons/ti';
import { BiSolidCategoryAlt } from 'react-icons/bi';
import { FaRegCalendarDays } from 'react-icons/fa6';
import { VscOrganization } from "react-icons/vsc";
import { FaEnvelopeOpenText } from "react-icons/fa";
import { ImQuestion } from "react-icons/im";
import { FaPeopleCarry } from "react-icons/fa";
import { FaWifi } from "react-icons/fa";
import { MdSummarize } from "react-icons/md";
import { ImAirplane } from "react-icons/im";
import { GiSpellBook } from "react-icons/gi";

// Admin Imports
import MainDashboard from 'views/admin/default';
import Admins from 'views/admin/admins/Admins';
import AddAdmin from 'views/admin/admins/AddAdmin';
import Roles from 'views/admin/roles/Roles';
import AddRole from 'views/admin/roles/AddRole';
import SocialMedia from 'views/admin/socialMedia/SocialMedia';
import AddSocialLink from 'views/admin/socialMedia/AddSocialLink';
import StudentTestimonials from 'views/admin/student/StudentTestimonials';
import AllCategories from 'views/admin/category/AllCategories';
import AddCategory from 'views/admin/category/AddCategory';
import Blogs from 'views/admin/blog/Blogs';
import AddBlog from 'views/admin/blog/AddBlog';
import Positions from 'views/admin/positions/Positions';
import AddPosition from 'views/admin/positions/AddPositions';
import Banner from 'views/admin/banner/Banner';
import UpdateBanner from 'views/admin/banner/UpdateBanner';
import AddBanner from 'views/admin/banner/AddBanner';
import About from 'views/admin/about-us/About';
import AddAbout from 'views/admin/about-us/AddAbout';
import PrivcyAndPolicy from 'views/admin/privcyAndPolicy/PrivcyAndPolicy';
import AddPrivcy from 'views/admin/privcyAndPolicy/AddPrivcy';
import WhyUniBridge from 'views/admin/why/WhyUniBridge';
import AddReason from 'views/admin/why/AddReason';
import Partners from 'views/admin/partners/Partners';
import AddPartner from 'views/admin/partners/AddPartner';
import UpdatePartner from 'views/admin/partners/UpdatePartner';
import ProtectedRoute from 'components/protectedRoute/ProtectedRoute';
import EditRole from 'views/admin/roles/EditRole';
import OnlineCourses from 'views/admin/courses/OnlineCourses';
import AddOnlineCourse from 'views/admin/courses/AddOnlineCourse';
import Providers from 'views/admin/providers/Providers';
import AddProvider from 'views/admin/providers/AddProvider';
import Inquires from 'views/admin/inquires/Inquires';
import EditAdmin from 'views/admin/admins/EditAdmin';
import ShowAdmin from 'views/admin/admins/ShowAdmin';
import JoinUsRequests from 'views/admin/joinUs/JoinUsRequests';
import EditCategory from 'views/admin/category/EditCategory';
import Contacts from 'views/admin/contact-us/Contacts';
import AddContact from 'views/admin/contact-us/AddContact';
import PopularMajors from 'views/admin/majors/PopularMajors';
import AddMajor from 'views/admin/majors/AddMajor';
import UpdateMajor from 'views/admin/majors/UpdateMajor';
import AddTestimonial from 'views/admin/student/AddTestimonial';
import ShortCourses from 'views/admin/courses/ShortCourses';
import AddShortCourse from 'views/admin/courses/AddShortCourse';
import StudyAbroad from 'views/admin/studyAbroad/StudyAbroad';
import AddProgram from 'views/admin/studyAbroad/AddProgram';
import OnlineApps from 'views/admin/applications/OnlineApps';
import ShortApps from 'views/admin/applications/ShortApps';
import StudyAbroadApps from 'views/admin/applications/StudyAbroadApps';
import EditPrivacy from 'views/admin/privcyAndPolicy/EditPrivacy';
import EditAbout from 'views/admin/about-us/EditAbout';
import EditProvider from 'views/admin/providers/EditProvider';
import EditPosition from 'views/admin/positions/EditPosition';
import EditContact from 'views/admin/contact-us/EditContact';

const routes = [
  {
    name: 'Super Admin',
    layout: '/admin',
    path: '/dashboard',
    icon: <Icon as={MdHome} width="20px" height="20px" color="inherit" />,
    component:<ProtectedRoute><MainDashboard /></ProtectedRoute> ,
    showInSidebar: true,
  },
  /* Start Admin Routes */
  {
    name: 'Admin Management',
    layout: '/admin',
    icon: (
      <Icon
      as={MdAdminPanelSettings}
      width="20px"
      height="20px"
      color="#8f9bba"
      />
    ),
    component: null,
    showInSidebar: true,
    subRoutes: [
      {
        name: 'Admins',
        path: '/admins',
        icon: <Icon as={TiMinus} width="20px" height="20px" color="inherit" />,
        component: <Admins />,
        showInSidebar: true,
      },
      {
        name: 'Roles',
        path: '/roles',
        icon: <Icon as={TiMinus} width="20px" height="20px" color="inherit" />,
        component: <Roles />,
        showInSidebar: true,
      },
    ],
  },
  {
    name: 'Admin Management',
    layout: '/admin',
    path: '/add-New-Rule',
    icon: (
      <Icon as={FaRegCalendarDays} width="20px" height="20px" color="inherit" />
    ),
    component: <AddRole />,
    showInSidebar: false,
  },
  {
    name: 'Admin Management',
    layout: '/admin',
    path: '/edit/rule/:id',
    icon: (
      <Icon as={FaRegCalendarDays} width="20px" height="20px" color="inherit" />
    ),
    component: <EditRole />,
    showInSidebar: false,
  },
  {
    name: 'Admin Management',
    layout: '/admin',
    path: '/add-admin',
    component: <AddAdmin />,
    showInSidebar: false,
  },
  {
    name: 'Admin Management',
    layout: '/admin',
    path: '/edit-admin/:id',
    component: <EditAdmin />,
    showInSidebar: false,
  },
  {
    name: 'Admin Management',
    layout: '/admin',
    path: '/admin/details/:id',
    component: <ShowAdmin />,
    showInSidebar: false,
  },
  /* End Admin Routes */

  /* Start CMS Routes */
  {
    name: 'CMS',
    layout: '/admin',
    icon: <Icon as={MdSettings} width="20px" height="20px" color="#8f9bba" />,
    component: null,
    showInSidebar: true,
    subRoutes: [
      {
        name: 'Our Partners',
        path: '/partners',
        icon: <Icon as={TiMinus} width="20px" height="20px" color="inherit" />,
        component: <Partners />,
        showInSidebar: true,
      },
      {
        name: 'Join Us Requests',
        path: '/joinUs/requests',
        icon: <Icon as={TiMinus} width="20px" height="20px" color="inherit" />,
        component: <JoinUsRequests />,
        showInSidebar: true,
      },
      {
        name: 'Inquires',
        path: '/inquires',
        icon: <Icon as={TiMinus} width="20px" height="20px" color="inherit" />,
        component: <Inquires />,
        showInSidebar: true,
      },
      {
        name: 'Providers',
        path: '/providers',
        icon: <Icon as={TiMinus} width="20px" height="20px" color="inherit" />,
        component: <Providers />,
        showInSidebar: true,
      },
      {
        name: 'Popular Majors',
        path: '/majors',
        icon: <Icon as={TiMinus} width="20px" height="20px" color="inherit" />,
        component: <PopularMajors />,
        showInSidebar: true,
      },
      {
        name: 'Student Testimonials',
        path: '/student-testimonials',
        icon: <Icon as={TiMinus} width="20px" height="20px" color="inherit" />,
        component: <StudentTestimonials />,
        showInSidebar: true,
      },
      {
        name: 'Banners',
        path: '/cms/banners',
        icon: <Icon as={TiMinus} width="20px" height="20px" color="inherit" />,
        component: <Banner />,
        showInSidebar: true,
      },
      {
        name: 'About Us',
        path: '/cms/about-us',
        icon: <Icon as={TiMinus} width="20px" height="20px" color="inherit" />,
        component: <About />,
        showInSidebar: true,
      },
      {
        name: 'Privacy & Policy',
        path: '/cms/privacy-and-policy',
        icon: <Icon as={TiMinus} width="20px" height="20px" color="inherit" />,
        component: <PrivcyAndPolicy />,
        showInSidebar: true,
      },
      {
        name: 'Blogs',
        path: '/blogs',
        icon: <Icon as={TiMinus} width="20px" height="20px" color="inherit" />,
        component: <Blogs />,
        showInSidebar: true,
      },
      {
        name: 'Contact Us',
        path: '/contacts',
        icon: <Icon as={TiMinus} width="20px" height="20px" color="inherit" />,
        component: <Contacts />,
        showInSidebar: true,
      },
      
      {
        name: 'Positions',
        path: '/cms/positions',
        icon: <Icon as={TiMinus} width="20px" height="20px" color="inherit" />,
        component: <Positions />,
        showInSidebar: true,
      },
      {
        name: 'Social Media Links',
        path: '/cms/socials',
        icon: <Icon as={TiMinus} width="20px" height="20px" color="inherit" />,
        component: <SocialMedia />,
        showInSidebar: true,
      },
      {
        name: 'Why Uni Bridge',
        path: '/cms/why-uni-bridge',
        icon: <Icon as={TiMinus} width="20px" height="20px" color="inherit" />,
        component: <WhyUniBridge />,
        showInSidebar: true,
      },
    ],
  },
  /* End CMS Routes */

  {
    name: 'Our Partners',
    layout: '/admin',
    path: '/add-partner',
    component: <AddPartner />,
    showInSidebar: false,
  },

  /* Start Providers Routes */
  {
    name: 'Providers',
    layout: '/admin',
    path: '/add-provider',
    component: <AddProvider />,
    showInSidebar: false,
  },
  {
    name: 'Providers',
    layout: '/admin',
    path: '/edit-provider/:id',
    component: <EditProvider />,
    showInSidebar: false,
  },
  /* End Providers Routes */
  

    /* Start Categories Routes */
    {
      name: 'Categories',
      layout: '/admin',
      path: '/categories',
      icon: (
        <Icon
        as={BiSolidCategoryAlt}
        width="20px"
        height="20px"
        color="inherit"
        />
      ),
      component: <AllCategories />,
      showInSidebar: true,
    },
    {
      name: 'Categories',
      layout: '/admin',
      path: '/add-category',
      icon: (
        <Icon
        as={BiSolidCategoryAlt}
          width="20px"
          height="20px"
          color="inherit"
          />
        ),
        component: <AddCategory />,
        showInSidebar: false,
      },
      {
        name: 'Categories',
      layout: '/admin',
      path: '/edit-category/:id',
      icon: (
        <Icon
        as={BiSolidCategoryAlt}
        width="20px"
        height="20px"
        color="inherit"
        />
      ),
      component: <EditCategory />,
      showInSidebar: false,
    },
    /* End Categories Routes */

       /* Start Popular Majors Routes */
        {
        name: 'Popular Majors',
        layout: '/admin',
        path: '/add-major',
        component: <AddMajor />,
        showInSidebar: false,
      },
      /* End Popular Majors Routes */

      /* Start  Student Testimonials Routes */
      {
        name: 'Student Testimonials',
        layout: '/admin',
        path: '/add-testimonial',
        icon: (
          <Icon as={TbBrandAdonisJs} width="20px" height="20px" color="inherit" />
        ),
        component: <AddTestimonial />,
        showInSidebar: false,
      },
      /* End Student Testimonials Routes */

      
  /* Start Online Courses Routes */
  {
    name: 'Online Courses',
    layout: '/admin',
    path: '/online-courses',
    icon: <Icon as={FaWifi} width="20px" height="20px" color="inherit" />,
    component: <OnlineCourses />,
    showInSidebar: true,
  },
  {
    name: 'Online Courses',
    layout: '/admin',
    path: '/add-online-course',
    component: <AddOnlineCourse />,
    showInSidebar: false,
  },

  /* Start Short Courses Routes */
  {
    name: 'Short Courses',
    layout: '/admin',
    path: '/short-courses',
    icon: <Icon as={MdSummarize} width="20px" height="20px" color="inherit" />,
    component: <ShortCourses />,
    showInSidebar: true,
  },
  {
    name: 'Short Courses',
    layout: '/admin',
    path: '/add-short-course',
    component: <AddShortCourse />,
    showInSidebar: false,
  },

  /* End Short Courses Routes */

  /* Start Study Abroad Routes */
  {
    name: 'Study Abroad',
    layout: '/admin',
    path: '/study-abroad',
    icon: <Icon as={ImAirplane} width="20px" height="20px" color="inherit" />,
    component: <StudyAbroad />,
    showInSidebar: true,
  },
  {
    name: 'Study Abroad',
    layout: '/admin',
    path: '/add-study-abroad',
    component: <AddProgram />,
    showInSidebar: false,
  },
  /* End Study Abroad Routes */

  /* Start Social Media Links Routes */
  {
    name: 'Social Media Links',
    layout: '/admin',
    path: '/add-social-link',
    icon: <Icon as={MdCategory} width="20px" height="20px" color="inherit" />,
    component: <AddSocialLink />,
    showInSidebar: false,
  },
  /* End Social Media Links Routes */

  /* Start Application Routes */
  {
    name: 'Applications',
    layout: '/admin',
    icon: (
      <Icon
      as={GiSpellBook}
      width="20px"
      height="20px"
      color="#8f9bba"
      />
    ),
    component: null,
    showInSidebar: true,
    subRoutes: [
      {
        name: 'Online Courses',
        path: '/online/apps',
        icon: <Icon as={TiMinus} width="20px" height="20px" color="inherit" />,
        component: <OnlineApps />,
        showInSidebar: true,
      },
      {
        name: 'Short Courses',
        path: '/short/apps',
        icon: <Icon as={TiMinus} width="20px" height="20px" color="inherit" />,
        component: <ShortApps />,
        showInSidebar: true,
      },
      {
        name: 'Study Abroad',
        path: '/study/abroad/apps',
        icon: <Icon as={TiMinus} width="20px" height="20px" color="inherit" />,
        component: <StudyAbroadApps />,
        showInSidebar: true,
      },
    ],
  },
  {
    name: 'Add Contact',
    layout: '/admin',
    path: '/add-contact',
    icon: <Icon as={TiMinus} width="20px" height="20px" color="inherit" />,
    component: <AddContact />,
    showInSidebar: false,
  },
  {
    name: 'Add Contact',
    layout: '/admin',
    path: '/edit-contact/:id',
    icon: <Icon as={TiMinus} width="20px" height="20px" color="inherit" />,
    component: <EditContact />,
    showInSidebar: false,
  },
  {
    name: 'Add blog',
    layout: '/admin',
    path: '/add-blog',
    icon: <Icon as={TiMinus} width="20px" height="20px" color="inherit" />,
    component: <AddBlog />,
    showInSidebar: false,
  },
  {
    name: 'Add Position',
    layout: '/admin', 
    path: '/cms/add-position',
    icon: <Icon as={TiMinus} width="20px" height="20px" color="inherit" />,
    component: <AddPosition />,
    showInSidebar: false,
  },
  {
    name: 'Add Position',
    layout: '/admin', 
    path: '/cms/edit-position/:id',
    icon: <Icon as={TiMinus} width="20px" height="20px" color="inherit" />,
    component: <EditPosition />,
    showInSidebar: false,
  },
  {
    name: 'Add Banner',
    layout: '/admin', 
    path: '/cms/add-banner',
    icon: <Icon as={TiMinus} width="20px" height="20px" color="inherit" />,
    component: <AddBanner />,
    showInSidebar: false,
  },
  {
    name: 'Add About',
    layout: '/admin', 
    path: '/cms/add-about',
    icon: <Icon as={TiMinus} width="20px" height="20px" color="inherit" />,
    component: <AddAbout />,
    showInSidebar: false,
  },
  {
    name: 'edit About',
    layout: '/admin', 
    path: '/cms/edit-about/:id',
    icon: <Icon as={TiMinus} width="20px" height="20px" color="inherit" />,
    component: <EditAbout />,
    showInSidebar: false,
  },
  {
    name: 'Add Privacy & Policy',
    layout: '/admin', 
    path: '/cms/add-privcy',
    component: <AddPrivcy />,
    showInSidebar: false,
  },
  {
    name: 'Add Privacy & Policy',
    layout: '/admin', 
    path: '/cms/edit-privcy/:id',
    component: <EditPrivacy />,
    showInSidebar: false,
  },
  {
    name: 'Add Reason',
    layout: '/admin', 
    path: '/cms/add-why-unibridge',
    component: <AddReason />,
    showInSidebar: false,
  },
  {
    name: 'Partners',
    layout: '/admin', 
    path: '/cms/update-partner/:id',
    component: <UpdatePartner />,
    showInSidebar: false,
  },
  {
    name: 'Banners',
    layout: '/admin', 
    path: 'cms/edit-banner/:id',
    component: <UpdateBanner />,
    showInSidebar: false,
  },
  {
    name: 'Popular Majors',
    layout: '/admin', 
    path: 'cms/edit-major/:id',
    component: <UpdateMajor />,
    showInSidebar: false,
  },
];

export default routes;
