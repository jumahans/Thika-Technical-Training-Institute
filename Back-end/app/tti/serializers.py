# serializers.py

from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import (
    CustomUser, AcademicYear, Semester, Event, Unit, course,
    UnitRegistration, AcademicResult, ExamCard, FeeStructure, FeePayment,
    ClearanceRecord, Hostel, Room, HostelBooking, DisciplinaryCase,
    StudentReporting, Attachment, StudentForm, LostCardReport
)


# ─── AUTH ────────────────────────────────────────────────────────────────────

class RegisterSerializer(serializers.ModelSerializer):
    password  = serializers.CharField(write_only=True, min_length=8)
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model  = CustomUser
        fields = [
            'admission_number', 'full_name', 'email', 'phone_number',
            'date_of_birth', 'gender', 'national_id', 'profile_photo',
            'address', 'next_of_kin_name', 'next_of_kin_phone',
            'course', 'year_of_study', 'admission_year',
            'password', 'password2'
        ]

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError("Passwords do not match.")
        return data

    def create(self, validated_data):
        validated_data.pop('password2')
        password = validated_data.pop('password')
        user = CustomUser(**validated_data)
        user.set_password(password)
        user.save()
        return user


class LoginSerializer(serializers.Serializer):
    admission_number = serializers.CharField()
    password         = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate(
            username=data['admission_number'],
            password=data['password']
        )
        if not user:
            raise serializers.ValidationError("Invalid admission number or password.")
        if not user.is_active:
            raise serializers.ValidationError("Account is disabled.")
        data['user'] = user
        return data


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model  = CustomUser
        fields = [
            'id', 'admission_number', 'full_name', 'email', 'phone_number',
            'date_of_birth', 'gender', 'national_id', 'profile_photo',
            'address', 'next_of_kin_name', 'next_of_kin_phone',
            'course', 'year_of_study', 'admission_year',
            'created_at'
        ]
        read_only_fields = ['admission_number', 'created_at']


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(write_only=True, min_length=8)
    new_password2 = serializers.CharField(write_only=True)

    def validate(self, data):
        if data['new_password'] != data['new_password2']:
            raise serializers.ValidationError("New passwords do not match.")
        return data

    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is incorrect.")
        return value

    def save(self):
        user = self.context['request'].user
        user.set_password(self.validated_data['new_password'])
        user.save()


# ─── REFERENCE TABLES ────────────────────────────────────────────────────────

class AcademicYearSerializer(serializers.ModelSerializer):
    class Meta:
        model  = AcademicYear
        fields = '__all__'


class SemesterSerializer(serializers.ModelSerializer):
    academic_year_label = serializers.CharField(source='academic_year.label', read_only=True)

    class Meta:
        model  = Semester
        fields = '__all__'


# ─── EVENTS ──────────────────────────────────────────────────────────────────

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Event
        fields = '__all__'


# ─── UNITS ───────────────────────────────────────────────────────────────────

class UnitSerializer(serializers.ModelSerializer):
    semester_name      = serializers.CharField(source='semester.name', read_only=True)
    academic_year      = serializers.CharField(source='semester.academic_year.label', read_only=True)

    class Meta:
        model  = Unit
        fields = '__all__'

class CourseSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source='department.name', read_only=True)

    class Meta:
        model  = course
        fields = '__all__'




# ─── UNIT REGISTRATION ───────────────────────────────────────────────────────

class UnitRegistrationSerializer(serializers.ModelSerializer):
    units         = UnitSerializer(many=True, read_only=True)
    unit_ids      = serializers.PrimaryKeyRelatedField(
                        queryset=Unit.objects.all(),
                        many=True, write_only=True, source='units'
                    )
    semester_name      = serializers.CharField(source='semester.name', read_only=True)
    academic_year_label = serializers.CharField(source='academic_year.label', read_only=True)

    class Meta:
        model  = UnitRegistration
        fields = [
            'id', 'academic_year', 'academic_year_label',
            'semester', 'semester_name', 'units', 'unit_ids',
            'status', 'registered_at'
        ]
        read_only_fields = ['student', 'status', 'registered_at']


# ─── ACADEMIC RESULTS ────────────────────────────────────────────────────────

class AcademicResultSerializer(serializers.ModelSerializer):
    unit_code     = serializers.CharField(source='unit.code', read_only=True)
    unit_name     = serializers.CharField(source='unit.name', read_only=True)
    semester_name = serializers.CharField(source='semester.name', read_only=True)
    academic_year = serializers.CharField(source='academic_year.label', read_only=True)

    class Meta:
        model  = AcademicResult
        fields = '__all__'
        read_only_fields = ['student', 'recorded_at']


# ─── EXAM CARD ───────────────────────────────────────────────────────────────

class ExamCardSerializer(serializers.ModelSerializer):
    registered_units  = UnitSerializer(many=True, read_only=True)
    semester_name     = serializers.CharField(source='semester.name', read_only=True)
    academic_year     = serializers.CharField(source='academic_year.label', read_only=True)
    student_name      = serializers.CharField(source='student.full_name', read_only=True)
    admission_number  = serializers.CharField(source='student.admission_number', read_only=True)
    course            = serializers.CharField(source='student.course', read_only=True)
    department        = serializers.CharField(source='student.department', read_only=True)

    class Meta:
        model  = ExamCard
        fields = '__all__'
        read_only_fields = ['student', 'generated_at']


# ─── FEES ─────────────────────────────────────────────────────────────────────

class FeeStructureSerializer(serializers.ModelSerializer):
    academic_year_label = serializers.CharField(source='academic_year.label', read_only=True)

    class Meta:
        model  = FeeStructure
        fields = '__all__'


class FeePaymentSerializer(serializers.ModelSerializer):
    academic_year_label = serializers.CharField(source='academic_year.label', read_only=True)
    semester_name       = serializers.CharField(source='semester.name', read_only=True)

    class Meta:
        model  = FeePayment
        fields = '__all__'
        read_only_fields = ['student', 'verified']


# ─── CLEARANCE ───────────────────────────────────────────────────────────────

class ClearanceRecordSerializer(serializers.ModelSerializer):
    semester_name = serializers.CharField(source='semester.name', read_only=True)

    class Meta:
        model  = ClearanceRecord
        fields = '__all__'
        read_only_fields = ['student', 'cleared', 'cleared_at']


# ─── HOSTEL ──────────────────────────────────────────────────────────────────

class HostelSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Hostel
        fields = '__all__'


class RoomSerializer(serializers.ModelSerializer):
    hostel_name = serializers.CharField(source='hostel.name', read_only=True)

    class Meta:
        model  = Room
        fields = '__all__'


class HostelBookingSerializer(serializers.ModelSerializer):
    room_number   = serializers.CharField(source='room.number', read_only=True)
    hostel_name   = serializers.CharField(source='room.hostel.name', read_only=True)
    semester_name = serializers.CharField(source='semester.name', read_only=True)

    class Meta:
        model  = HostelBooking
        fields = '__all__'
        read_only_fields = ['student', 'status', 'booked_at']


# ─── DISCIPLINARY ────────────────────────────────────────────────────────────

class DisciplinaryCaseSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.full_name', read_only=True)

    class Meta:
        model  = DisciplinaryCase
        fields = '__all__'
        read_only_fields = ['student']


# ─── REPORTING ───────────────────────────────────────────────────────────────

class StudentReportingSerializer(serializers.ModelSerializer):
    semester_name = serializers.CharField(source='semester.name', read_only=True)

    class Meta:
        model  = StudentReporting
        fields = '__all__'
        read_only_fields = ['student']


# ─── ATTACHMENTS ─────────────────────────────────────────────────────────────

class AttachmentSerializer(serializers.ModelSerializer):
    duration = serializers.SerializerMethodField()

    class Meta:
        model  = Attachment
        fields = '__all__'
        read_only_fields = ['student', 'status']

    def get_duration(self, obj):
        if obj.start_date and obj.end_date:
            delta = obj.end_date - obj.start_date
            return f"{delta.days} days"
        return None


# ─── STUDENT FORMS ───────────────────────────────────────────────────────────

class StudentFormSerializer(serializers.ModelSerializer):
    class Meta:
        model  = StudentForm
        fields = '__all__'
        read_only_fields = ['student', 'submission_date', 'status']


# ─── LOST CARD ───────────────────────────────────────────────────────────────

class LostCardReportSerializer(serializers.ModelSerializer):
    class Meta:
        model  = LostCardReport
        fields = '__all__'
        read_only_fields = ['student', 'report_date', 'replacement_status']


# ─── DASHBOARD ───────────────────────────────────────────────────────────────

class DashboardSerializer(serializers.Serializer):
    # Student info
    full_name        = serializers.CharField()
    admission_number = serializers.CharField()
    course           = serializers.CharField()
    department       = serializers.CharField()
    year_of_study    = serializers.IntegerField()
    profile_photo    = serializers.ImageField()

    # Financial
    total_fees_required = serializers.DecimalField(max_digits=12, decimal_places=2)
    total_fees_paid     = serializers.DecimalField(max_digits=12, decimal_places=2)
    fee_balance         = serializers.DecimalField(max_digits=12, decimal_places=2)

    # Academic
    total_units_registered = serializers.IntegerField()
    units_completed        = serializers.IntegerField()
    units_pending          = serializers.IntegerField()