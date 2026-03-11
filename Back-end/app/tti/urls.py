# urls.py

from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterView, LoginView, LogoutView, ProfileView, ChangePasswordView,
    DashboardView, EventListView, EventDetailView, UnitListView,
    UnitRegistrationView, UnitRegistrationDetailView,
    AcademicResultListView, ExamCardView, FeeStructureView,
    FeePaymentListView, FeeSummaryView, ClearanceRecordView,
    HostelListView, RoomListView, HostelBookingView, DisciplinaryCaseView,
    StudentReportingView, AttachmentView, AttachmentDetailView,
    StudentFormView, StudentFormDetailView, LostCardReportView,
    AcademicYearListView, SemesterListView, CourseListView
)

urlpatterns = [

    # ─── AUTH ────────────────────────────────────────────────────────────────
    path('auth/register/',         RegisterView.as_view(),       name='register'),
    path('auth/login/',            LoginView.as_view(),          name='login'),
    path('auth/logout/',           LogoutView.as_view(),         name='logout'),
    path('auth/token/refresh/',    TokenRefreshView.as_view(),   name='token-refresh'),
    path('auth/profile/',          ProfileView.as_view(),        name='profile'),
    path('auth/change-password/',  ChangePasswordView.as_view(), name='change-password'),

    # ─── DASHBOARD ───────────────────────────────────────────────────────────
    path('dashboard/',             DashboardView.as_view(),      name='dashboard'),

    # ─── EVENTS ──────────────────────────────────────────────────────────────
    path('events/',                EventListView.as_view(),      name='events'),
    path('events/<int:pk>/',       EventDetailView.as_view(),    name='event-detail'),

    # ─── UNITS ───────────────────────────────────────────────────────────────
    path('units/',                 UnitListView.as_view(),       name='units'),
    path('courses/',               CourseListView.as_view(),     name='courses'),

    # ─── UNIT REGISTRATION ───────────────────────────────────────────────────
    path('unit-registration/',           UnitRegistrationView.as_view(),       name='unit-registration'),
    path('unit-registration/<int:pk>/',  UnitRegistrationDetailView.as_view(), name='unit-registration-detail'),

    # ─── ACADEMIC RESULTS ────────────────────────────────────────────────────
    path('results/',               AcademicResultListView.as_view(), name='results'),

    # ─── EXAM CARD ───────────────────────────────────────────────────────────
    path('exam-card/',             ExamCardView.as_view(),       name='exam-card'),

    # ─── FEES ────────────────────────────────────────────────────────────────
    path('fees/structure/',        FeeStructureView.as_view(),   name='fee-structure'),
    path('fees/payments/',         FeePaymentListView.as_view(), name='fee-payments'),
    path('fees/summary/',          FeeSummaryView.as_view(),     name='fee-summary'),

    # ─── CLEARANCE ───────────────────────────────────────────────────────────
    path('clearance/',             ClearanceRecordView.as_view(), name='clearance'),

    # ─── HOSTEL ──────────────────────────────────────────────────────────────
    path('hostel/',                HostelListView.as_view(),     name='hostels'),
    path('hostel/rooms/',          RoomListView.as_view(),       name='rooms'),
    path('hostel/bookings/',       HostelBookingView.as_view(),  name='hostel-bookings'),

    # ─── DISCIPLINARY ────────────────────────────────────────────────────────
    path('disciplinary/',          DisciplinaryCaseView.as_view(), name='disciplinary'),

    # ─── REPORTING ───────────────────────────────────────────────────────────
    path('reporting/',             StudentReportingView.as_view(), name='reporting'),

    # ─── ATTACHMENTS ─────────────────────────────────────────────────────────
    path('attachments/',           AttachmentView.as_view(),        name='attachments'),
    path('attachments/<int:pk>/',  AttachmentDetailView.as_view(),  name='attachment-detail'),

    # ─── STUDENT FORMS ───────────────────────────────────────────────────────
    path('forms/',                 StudentFormView.as_view(),        name='student-forms'),
    path('forms/<int:pk>/',        StudentFormDetailView.as_view(),  name='student-form-detail'),

    # ─── LOST CARD ───────────────────────────────────────────────────────────
    path('lost-card/',             LostCardReportView.as_view(),  name='lost-card'),

    # ─── REFERENCE ───────────────────────────────────────────────────────────
    path('academic-years/',        AcademicYearListView.as_view(), name='academic-years'),
    path('semesters/',             SemesterListView.as_view(),     name='semesters'),

]