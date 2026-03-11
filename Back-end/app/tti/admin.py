from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import (
    CustomUser, AcademicYear, Semester, Event, Unit,
    UnitRegistration, AcademicResult, ExamCard, FeeStructure, FeePayment,
    ClearanceRecord, Hostel, Room, HostelBooking, DisciplinaryCase,
    StudentReporting, Attachment, StudentForm, LostCardReport, course, Department
)

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    list_display = [
        'admission_number',
        'full_name',
        'email',
        'course',
        'year_of_study',
        'is_active',
        'is_staff',
    ]
    list_filter = ['is_active', 'is_staff', 'year_of_study', 'course', 'gender']
    search_fields = ['admission_number', 'full_name', 'email', 'national_id', 'phone_number']
    ordering = ['admission_number']

    # ─── Fields shown when editing an existing user ──────────────────────────
    fieldsets = (
        (None, {
            'fields': ('admission_number', 'password')
        }),
        ('Personal information', {
            'fields': (
                'full_name',
                'email',
                'phone_number',
                'date_of_birth',
                'gender',
                'national_id',
                'profile_photo',
                'address',
            )
        }),
        ('Academic information', {
            'fields': (
                'course',
                'year_of_study',
                'admission_year',
            )
        }),
        ('Next of kin', {
            'fields': (
                'next_of_kin_name',
                'next_of_kin_phone',
            )
        }),
        ('Permissions', {
            'fields': (
                'is_active',
                'is_staff',
                'is_superuser',
                'groups',
                'user_permissions',
            ),
        }),
    )

    # ─── Fields shown when adding a NEW user ─────────────────────────────────
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': (
                'admission_number',
                'full_name',
                'email',
                'phone_number',
                'date_of_birth',
                'gender',
                'national_id',
                'address',
                'next_of_kin_name',
                'next_of_kin_phone',
                'course',
                'year_of_study',
                'admission_year',
                'password1',
                'password2',
                'is_active',
                'is_staff',
            ),
        }),
    )

    # Optional: make some fields read-only after creation if you want
    readonly_fields = ['created_at']
@admin.register(AcademicYear)
class AcademicYearAdmin(admin.ModelAdmin):
    list_display  = ['label', 'is_current']
    search_fields = ['label']

@admin.register(Semester)
class SemesterAdmin(admin.ModelAdmin):
    list_display  = ['name', 'academic_year', 'start_date', 'end_date', 'is_current']
    search_fields = ['name']

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display  = ['title', 'date', 'location', 'organizer']
    search_fields = ['title', 'organizer']

@admin.register(course)
class courseAdmin(admin.ModelAdmin):
    list_display  = ['code', 'name']
    search_fields = ['code', 'name']


@admin.register(Unit)
class UnitAdmin(admin.ModelAdmin):
    list_display = [
        'code',
        'name',
        'get_courses_display',     
    ]
    
    search_fields = ['code', 'name']           
    
    @admin.display(description='Courses')
    def get_courses_display(self, obj):
        count = obj.course.count()
        return count if count > 0 else "—"
        


@admin.register(Department)
class DepartmentAdmin(admin.ModelAdmin):
    list_display  = ['name']
    search_fields = ['name']

@admin.register(UnitRegistration)
class UnitRegistrationAdmin(admin.ModelAdmin):
    list_display  = ['student', 'semester', 'academic_year', 'status', 'registered_at']
    search_fields = ['student__admission_number', 'student__full_name']
    list_filter   = ['status', 'semester']

@admin.register(AcademicResult)
class AcademicResultAdmin(admin.ModelAdmin):
    list_display  = ['student', 'unit', 'semester', 'academic_year', 'grade', 'recorded_at']
    search_fields = ['student__admission_number', 'student__full_name', 'unit__code']
    list_filter   = ['grade', 'semester']

@admin.register(ExamCard)
class ExamCardAdmin(admin.ModelAdmin):
    list_display  = ['student', 'semester', 'academic_year', 'is_cleared', 'generated_at']
    search_fields = ['student__admission_number', 'student__full_name']
    list_filter   = ['is_cleared']

@admin.register(FeeStructure)
class FeeStructureAdmin(admin.ModelAdmin):
    list_display  = ['course', 'academic_year', 'semester', 'total_fees']
    search_fields = ['course']

@admin.register(FeePayment)
class FeePaymentAdmin(admin.ModelAdmin):
    list_display  = ['student', 'amount_paid', 'payment_method', 'transaction_ref', 'payment_date', 'verified']
    search_fields = ['student__admission_number', 'transaction_ref']
    list_filter   = ['verified', 'payment_method']

@admin.register(ClearanceRecord)
class ClearanceRecordAdmin(admin.ModelAdmin):
    list_display  = ['student', 'semester', 'department', 'cleared', 'cleared_at']
    search_fields = ['student__admission_number', 'student__full_name']
    list_filter   = ['cleared', 'department']

@admin.register(Hostel)
class HostelAdmin(admin.ModelAdmin):
    list_display  = ['name', 'gender', 'capacity']
    search_fields = ['name']

@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display  = ['hostel', 'number', 'capacity', 'is_available']
    search_fields = ['number', 'hostel__name']
    list_filter   = ['is_available']

@admin.register(HostelBooking)
class HostelBookingAdmin(admin.ModelAdmin):
    list_display  = ['student', 'room', 'semester', 'status', 'booked_at']
    search_fields = ['student__admission_number', 'student__full_name']
    list_filter   = ['status']

@admin.register(DisciplinaryCase)
class DisciplinaryCaseAdmin(admin.ModelAdmin):
    list_display  = ['student', 'case_title', 'date', 'status']
    search_fields = ['student__admission_number', 'case_title']
    list_filter   = ['status']

@admin.register(StudentReporting)
class StudentReportingAdmin(admin.ModelAdmin):
    list_display  = ['student', 'semester', 'reporting_date', 'status']
    search_fields = ['student__admission_number', 'student__full_name']
    list_filter   = ['status']

@admin.register(Attachment)
class AttachmentAdmin(admin.ModelAdmin):
    list_display  = ['student', 'organization', 'supervisor', 'start_date', 'end_date', 'status']
    search_fields = ['student__admission_number', 'organization']
    list_filter   = ['status']

@admin.register(StudentForm)
class StudentFormAdmin(admin.ModelAdmin):
    list_display  = ['student', 'form_type', 'submission_date', 'status']
    search_fields = ['student__admission_number', 'student__full_name']
    list_filter   = ['status', 'form_type']

@admin.register(LostCardReport)
class LostCardReportAdmin(admin.ModelAdmin):
    list_display  = ['student', 'report_date', 'replacement_status']
    search_fields = ['student__admission_number', 'student__full_name']
    list_filter   = ['replacement_status']