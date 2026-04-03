# views.py

from rest_framework import generics, status, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.db.models import Sum
from .models import (
    CustomUser, AcademicYear, Semester, Event, Unit, course,
    UnitRegistration, AcademicResult, ExamCard, FeeStructure, FeePayment,
    ClearanceRecord, Hostel, Room, HostelBooking, DisciplinaryCase,
    StudentReporting, Attachment, StudentForm, LostCardReport
)
from .serializers import (
    RegisterSerializer, LoginSerializer, ProfileSerializer, ChangePasswordSerializer,
    AcademicYearSerializer, SemesterSerializer, EventSerializer, UnitSerializer, UnitRegistrationSerializer, AcademicResultSerializer,
    ExamCardSerializer, FeeStructureSerializer, FeePaymentSerializer,
    ClearanceRecordSerializer, HostelSerializer, RoomSerializer, HostelBookingSerializer,
    DisciplinaryCaseSerializer, StudentReportingSerializer, AttachmentSerializer,
    StudentFormSerializer, LostCardReportSerializer, DashboardSerializer, CourseSerializer
)


# ─── AUTH ────────────────────────────────────────────────────────────────────

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access':  str(refresh.access_token),
            'user': ProfileSerializer(user).data
        })


class LogoutView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data['refresh']
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({'detail': 'Logged out successfully.'}, status=status.HTTP_205_RESET_CONTENT)
        except Exception:
            return Response({'detail': 'Invalid token.'}, status=status.HTTP_400_BAD_REQUEST)


class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class   = ProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class ChangePasswordView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({'detail': 'Password changed successfully.'})


# ─── DASHBOARD ───────────────────────────────────────────────────────────────

class DashboardView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        student = request.user

        # get current academic year and semester
        try:
            current_year     = AcademicYear.objects.get(is_current=True)
            current_semester = Semester.objects.get(is_current=True)
        except (AcademicYear.DoesNotExist, Semester.DoesNotExist):
            return Response({'detail': 'Academic year or semester not configured.'}, status=400)

        # ── fees ──
        try:
            fee_structure = FeeStructure.objects.get(
                course=student.course,
                academic_year=current_year,
            )
            total_required = fee_structure.total_fees
        except FeeStructure.DoesNotExist:
            total_required = 0

        total_paid = FeePayment.objects.filter(
            student=student,
            academic_year=current_year,
            verified=True
        ).aggregate(total=Sum('amount_paid'))['total'] or 0

        # ── academics ──
        registration = UnitRegistration.objects.filter(
            student=student,
            semester=current_semester,
            status='approved'
        ).first()

        total_registered = registration.units.count() if registration else 0

        results = AcademicResult.objects.filter(
            student=student,
            semester=current_semester
        )
        units_completed = results.exclude(grade='not_competent').count()
        units_pending   = total_registered - results.count()

        data = {
            'full_name':        student.full_name,
            'admission_number': student.admission_number,
            'course':           student.course,
            'department':       student.department,
            'year_of_study':    student.year_of_study,
            'profile_photo':    student.profile_photo.url if student.profile_photo else None,

            'total_fees_required':   total_required,
            'total_fees_paid':       total_paid,
            'fee_balance':           total_required - total_paid,

            'total_units_registered': total_registered,
            'units_completed':        units_completed,
            'units_pending':          units_pending,
        }

        return Response(data)


# ─── EVENTS ──────────────────────────────────────────────────────────────────

class EventListView(generics.ListAPIView):
    queryset           = Event.objects.all().order_by('-date')
    serializer_class   = EventSerializer
    permission_classes = [permissions.IsAuthenticated]


class EventDetailView(generics.RetrieveAPIView):
    queryset           = Event.objects.all()
    serializer_class   = EventSerializer
    permission_classes = [permissions.IsAuthenticated]


# ─── UNITS ───────────────────────────────────────────────────────────────────

class UnitListView(generics.ListAPIView):
    serializer_class   = UnitSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if not user.course:
            return Unit.objects.none()

        # Only return units the student has actually registered
        registered = UnitRegistration.objects.filter(
            student=user,
            status='approved'
        ).values_list('units', flat=True)

        if not registered:
            return Unit.objects.none()  # New student sees NOTHING until they register

        return Unit.objects.filter(id__in=registered)

class AvailableUnitsView(generics.ListAPIView):
    serializer_class   = UnitSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if not user.course:
            return Unit.objects.none()

        already_registered = UnitRegistration.objects.filter(
            student=user
        ).values_list('units', flat=True)

        return Unit.objects.filter(
            course=user.course,        # filter by course only
        ).exclude(id__in=already_registered).distinct()

class CourseListView(generics.ListAPIView):
    queryset           = course.objects.all()
    serializer_class   = CourseSerializer
    permission_classes = []



# ─── UNIT REGISTRATION ───────────────────────────────────────────────────────

class UnitRegistrationView(generics.ListCreateAPIView):
    serializer_class   = UnitRegistrationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UnitRegistration.objects.filter(student=self.request.user)

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)


class UnitRegistrationDetailView(generics.RetrieveAPIView):
    serializer_class   = UnitRegistrationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UnitRegistration.objects.filter(student=self.request.user)


# ─── ACADEMIC RESULTS ────────────────────────────────────────────────────────

class AcademicResultListView(generics.ListAPIView):
    serializer_class   = AcademicResultSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return AcademicResult.objects.filter(student=self.request.user)


# ─── EXAM CARD ───────────────────────────────────────────────────────────────

class ExamCardView(generics.ListAPIView):
    serializer_class   = ExamCardSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ExamCard.objects.filter(student=self.request.user)


# ─── FEES ─────────────────────────────────────────────────────────────────────

class FeeStructureView(generics.ListAPIView):
    serializer_class   = FeeStructureSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return FeeStructure.objects.filter(
            course=user.course,
            academic_year = user.year_of_study
        )


class FeePaymentListView(generics.ListAPIView):
    serializer_class   = FeePaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return FeePayment.objects.filter(student=self.request.user).order_by('-payment_date')


class FeeSummaryView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        try:
            current_year  = AcademicYear.objects.filter(is_current=True).latest('id')
            fee_structure = FeeStructure.objects.get(
                course=user.course,
                academic_year=current_year,
            )
            total_required = fee_structure.total_fees
        except (AcademicYear.DoesNotExist, FeeStructure.DoesNotExist):
            total_required = 0

        total_paid = FeePayment.objects.filter(
            student=user, verified=True
        ).aggregate(total=Sum('amount_paid'))['total'] or 0

        return Response({
            'total_required': total_required,
            'total_paid':     total_paid,
            'balance':        total_required - total_paid,
        })


# ─── CLEARANCE ───────────────────────────────────────────────────────────────

class ClearanceRecordView(generics.ListAPIView):
    serializer_class   = ClearanceRecordSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ClearanceRecord.objects.filter(student=self.request.user)


# ─── HOSTEL ──────────────────────────────────────────────────────────────────

class HostelListView(generics.ListAPIView):
    queryset           = Hostel.objects.all()
    serializer_class   = HostelSerializer
    permission_classes = [permissions.IsAuthenticated]


class RoomListView(generics.ListAPIView):
    serializer_class   = RoomSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Room.objects.filter(is_available=True)


class HostelBookingView(generics.ListCreateAPIView):
    serializer_class   = HostelBookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return HostelBooking.objects.filter(student=self.request.user)

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)


# ─── DISCIPLINARY ────────────────────────────────────────────────────────────

class DisciplinaryCaseView(generics.ListAPIView):
    serializer_class   = DisciplinaryCaseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return DisciplinaryCase.objects.filter(student=self.request.user)


# ─── REPORTING ───────────────────────────────────────────────────────────────

class StudentReportingView(generics.ListCreateAPIView):
    serializer_class   = StudentReportingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return StudentReporting.objects.filter(student=self.request.user)

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)


# ─── ATTACHMENTS ─────────────────────────────────────────────────────────────

class AttachmentView(generics.ListCreateAPIView):
    serializer_class   = AttachmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Attachment.objects.filter(student=self.request.user)

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)


class AttachmentDetailView(generics.RetrieveUpdateAPIView):
    serializer_class   = AttachmentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Attachment.objects.filter(student=self.request.user)


# ─── STUDENT FORMS ───────────────────────────────────────────────────────────

class StudentFormView(generics.ListCreateAPIView):
    serializer_class   = StudentFormSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return StudentForm.objects.filter(student=self.request.user)

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)


class StudentFormDetailView(generics.RetrieveAPIView):
    serializer_class   = StudentFormSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return StudentForm.objects.filter(student=self.request.user)


# ─── LOST CARD ───────────────────────────────────────────────────────────────

class LostCardReportView(generics.ListCreateAPIView):
    serializer_class   = LostCardReportSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return LostCardReport.objects.filter(student=self.request.user)

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)


# ─── ACADEMIC YEAR & SEMESTER ────────────────────────────────────────────────

class AcademicYearListView(generics.ListAPIView):
    queryset           = AcademicYear.objects.all()
    serializer_class   = AcademicYearSerializer
    permission_classes = [permissions.IsAuthenticated]


class SemesterListView(generics.ListAPIView):
    queryset           = Semester.objects.all()
    serializer_class   = SemesterSerializer
    permission_classes = [permissions.IsAuthenticated]