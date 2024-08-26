import React from 'react';
import { createBrowserRouter, Navigate } from "react-router-dom";
import RootLayout from "../layouts/rootLayout";
import AuthLayout from "../layouts/authLayout";
import ErrorPage from "../pages/error";
import Home from "../pages/home";
import RechercheBd from "../pages/rechercheBd";
import RechercheDant from "../pages/rechercheDant";
import RechercheMarque from "../pages/rechercheMarque";
import RechercheOpp from "../pages/rechercheOpp";
import RechercheTribunal from "../pages/rechercheTribunal";
import RechercheTribunalup from "../pages/rechercheTribunalupdate";
import RechercheDmi from "../pages/rechercheDmi";
import Formulaire from "../pages/formulaire";
import Formulaires from "../pages/formulaires";
import Result from "../pages/result";
import Comparison from "../pages/comparison";
import Validation from "../pages/validation";
import ValidationIpro from "../pages/ValidationVal1pro";
import ValidationIIpro from "../pages/ValidationVal2pro";
import Validationglobal from "../pages/Validationglobal";
import Validationglobalwl from "../pages/Validationglobalwl";
import StrongValid from "../pages/strongValid";
import StrongValidValIpro from "../pages/strongValidVal1pro";
import StrongValidValIIpro from "../pages/strongValidVal2pro";
import StrongValidglobal from "../pages/strongValidglobal";
import StrongValidglobalwl from "../pages/strongValidglobalwl";
import AddAlert from "../pages/addAlert";
import GeneratePdf from "../pages/generatePdf";
import Archive from "../pages/archive";
import RechercheOmpic from "../pages/rechercheOmpic";
import Notification from "../pages/notification";
import NotificationIpro from "../pages/notificationVal1pro";
import NotificationIIpro from "../pages/notificationVal2pro";
import Notificationglobal from "../pages/notificationglobal";
import Notificationglobalwl from "../pages/notificationglobalwl";
import RecherchePhon from "../pages/recherchePhon";
import Parameter from "../pages/parameter";
import CompareCompany from "../pages/compareCompany";
import NotificationManage from "../pages/notificationManage";
import NotificationManageIpro from "../pages/notificationManageVal1pro";
import NotificationManageIIpro from "../pages/notificationManageVal2pro";
import NotificationManageglobal from "../pages/notificationManageglobal";
import NotificationManageglobalwl from "../pages/notificationManageglobalwl";
import ImgValidation from "../pages/imgValidation";
import ImaSimilarity from "../pages/imaSimilarity";
import CourtDetails from "../pages/courtDetails";
import CompanyDetails from "../pages/companyDetails";
import Login from "../pages/login";
import Registration from "../pages/registration";
import DmiDetails from "../pages/dmidetails";
import Statsipp from "../pages/ipdata"; //Listwl.jsx
import Listwl from "../pages/Listwl"

const routes = createBrowserRouter([
  {
    path: "/",
    element: <Navigate replace to="/auth/login" />
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      { path: "login", element: <Login /> },
      { path: "registration", element: <Registration /> }
    ],
    errorElement: <ErrorPage />
  },
  {
    path: "/app",
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "recherche_bd", element: <RechercheBd /> },
      { path: "recherche_dant", element: <RechercheDant /> },
      { path: "recherche_marque", element: <RechercheMarque /> },
      { path: "recherche_ompic", element: <RechercheOmpic /> },
      { path: "recherche_opp", element: <RechercheOpp /> },
      { path: "recherche_tribunal", element: <RechercheTribunal /> },
      { path: "recherche_tribunal_up", element: <RechercheTribunalup /> },
      { path: "recherche_dmi", element: <RechercheDmi /> },
      { path: "formulaire", element: <Formulaire /> },
      { path: "formulaires", element: <Formulaires /> },
      { path: "result", element: <Result /> },
      { path: "comparison", element: <Comparison /> },
      { path: "validation", element: <Validation /> },
      { path: "validationIpro", element: <ValidationIpro /> },
      { path: "validationIIpro", element: <ValidationIIpro /> },
      { path: "Validation_global", element: <Validationglobal /> },
      { path: "Validation_globalwl", element: <Validationglobalwl /> },
      { path: "strong_valid", element: <StrongValid /> },
      { path: "strong_valid_global", element: <StrongValidglobal /> },
      { path: "strong_valid_globalwl", element: <StrongValidglobalwl /> },
      { path: "strongValidValIIpro", element: <StrongValidValIpro /> },
      { path: "strongValidValIIpro", element: <StrongValidValIIpro /> },
      { path: "add_alert", element: <AddAlert /> },
      { path: "generate_pdf", element: <GeneratePdf /> },
      { path: "archive", element: <Archive /> },
      { path: "notification", element: <Notification /> },
      { path: "notificationglobal", element: <Notificationglobal /> },
      { path: "notificationglobalwl", element: <Notificationglobalwl /> },
      { path: "notificationValIpro", element: <NotificationIpro /> },
      { path: "notificationValIIpro", element: <NotificationIIpro /> },
      { path: "recherche_phonetique", element: <RecherchePhon /> },
      { path: "parameter", element: <Parameter /> },
      { path: "compare", element: <CompareCompany /> },
      { path: "notification_manage", element: <NotificationManage /> },
      { path: "notification_manage_global", element: <NotificationManageglobal /> },
      { path: "notification_manage_globalwl", element: <NotificationManageglobalwl /> },
      { path: "notification_manage_Ipro", element: <NotificationManageIpro /> },
      { path: "notification_manage_IIpro", element: <NotificationManageIIpro /> },
      { path: "img_similarity", element: <ImaSimilarity /> },
      { path: "img_validation", element: <ImgValidation /> },
      { path: "court_details", element: <CourtDetails /> },
      { path: "company_details", element: <CompanyDetails /> },
      { path: "design_details", element: <DmiDetails /> },
      { path: "Stats", element: <Statsipp /> },
      { path: "Listwl", element: <Listwl /> },
      // Add other routes as needed
    ],
    errorElement: <ErrorPage />
  },
  // Handle undefined routes
  { path: "*", element: <ErrorPage /> }
]);

export default routes;
