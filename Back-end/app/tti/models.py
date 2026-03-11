# models.py

from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
from django.db import models


# ─── AUTH ────────────────────────────────────────────────────────────────────

class CustomUserManager(BaseUserManager):
    def create_user(self, admission_number, password=None, **extra_fields):
        user = self.model(admission_number=admission_number, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, admission_number, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(admission_number, password, **extra_fields)


class CustomUser(AbstractBaseUser, PermissionsMixin):
    GENDER_CHOICES = [('M', 'Male'), ('F', 'Female')]

    admission_number  = models.CharField(max_length=20, unique=True)
    full_name         = models.CharField(max_length=200)
    email             = models.EmailField(unique=True)
    phone_number      = models.CharField(max_length=20)
    date_of_birth     = models.DateField(null=True, blank=True)
    gender            = models.CharField(max_length=1, choices=GENDER_CHOICES)
    national_id       = models.CharField(max_length=50, unique=True)
    profile_photo     = models.ImageField(upload_to='profiles/', null=True, blank=True)
    address           = models.TextField(blank=True)
    next_of_kin_name  = models.CharField(max_length=200)
    next_of_kin_phone = models.CharField(max_length=20)
    course           = models.ForeignKey('course', on_delete=models.PROTECT, null=True, blank=True)
    year_of_study     = models.PositiveSmallIntegerField(default=1)
    admission_year = models.IntegerField(null=True, blank=True)
    is_active         = models.BooleanField(default=True)
    is_staff          = models.BooleanField(default=False)
    created_at        = models.DateTimeField(auto_now_add=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'admission_number'
    REQUIRED_FIELDS = ['email', 'full_name']
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='custom_user_set',
        blank=True
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='custom_user_set',
        blank=True
    )

    def __str__(self):
        return f"{self.full_name} ({self.admission_number})"


# ─── REFERENCE TABLES ────────────────────────────────────────────────────────

class AcademicYear(models.Model):
    label      = models.CharField(max_length=20)  # e.g. "2024/2025"
    is_current = models.BooleanField(default=False)

    def __str__(self):
        return self.label


class Semester(models.Model):
    name          = models.CharField(max_length=50)  # e.g. "Semester 1"
    academic_year = models.ForeignKey(AcademicYear, on_delete=models.CASCADE)
    start_date    = models.DateField()
    end_date      = models.DateField()
    is_current    = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.name} - {self.academic_year}"


# ─── EVENTS ──────────────────────────────────────────────────────────────────

class Event(models.Model):
    title       = models.CharField(max_length=200)
    description = models.TextField()
    date        = models.DateTimeField()
    location    = models.CharField(max_length=200)
    organizer   = models.CharField(max_length=200)
    image       = models.ImageField(upload_to='events/', null=True, blank=True)

    def __str__(self):
        return self.title


# ─── DEPARTMENTS ───────────────────────────────────────────────────────────────────
class Department(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name
# ─── COURCES ───────────────────────────────────────────────────────────────────
class course(models.Model):
    COURSE_LEVELS = (
        ('certificate', 'Certificate'),
        ('diploma', 'Diploma'),
    )
    code = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=200)
    level = models.CharField(max_length=20, choices=COURSE_LEVELS)
    department = models.ForeignKey(Department, on_delete=models.PROTECT, null=True, blank=True)

    def __str__(self):
        return f"{self.code} - {self.name}"


# ─── UNITS ───────────────────────────────────────────────────────────────────

class Unit(models.Model):
    code          = models.CharField(max_length=20, unique=True)
    name          = models.CharField(max_length=200)
    course        = models.ManyToManyField(course, blank=True, related_name='units', verbose_name='Courses this unit belongs to')
    year_of_study = models.PositiveSmallIntegerField()

    def __str__(self):
        return f"{self.code} - {self.name}"

 



# ─── UNIT REGISTRATION ───────────────────────────────────────────────────────

class UnitRegistration(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'), ('approved', 'Approved'), ('rejected', 'Rejected')
    ]

    student       = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    academic_year = models.ForeignKey(AcademicYear, on_delete=models.PROTECT)
    semester      = models.ForeignKey(Semester, on_delete=models.PROTECT)
    units         = models.ManyToManyField(Unit)
    status        = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    registered_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.student} - {self.semester}"


# ─── ACADEMIC RESULTS ────────────────────────────────────────────────────────

class AcademicResult(models.Model):
    GRADE_CHOICES = [
        ('mastery',       'Mastery'),
        ('proficient',    'Proficient'),
        ('competent',     'Competent'),
        ('not_competent', 'Not Competent'),
    ]

    student       = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    unit          = models.ForeignKey(Unit, on_delete=models.PROTECT)
    semester      = models.ForeignKey(Semester, on_delete=models.PROTECT)
    academic_year = models.ForeignKey(AcademicYear, on_delete=models.PROTECT)
    grade         = models.CharField(max_length=20, choices=GRADE_CHOICES)
    recorded_at   = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['student', 'unit', 'semester']

    def __str__(self):
        return f"{self.student} - {self.unit.code} - {self.grade}"


# ─── EXAM CARD ───────────────────────────────────────────────────────────────

class ExamCard(models.Model):
    student          = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    semester         = models.ForeignKey(Semester, on_delete=models.PROTECT)
    academic_year    = models.ForeignKey(AcademicYear, on_delete=models.PROTECT)
    registered_units = models.ManyToManyField(Unit)
    is_cleared       = models.BooleanField(default=False)
    generated_at     = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Exam Card - {self.student} - {self.semester}"


# ─── FEES ─────────────────────────────────────────────────────────────────────

class FeeStructure(models.Model):
    course        = models.ForeignKey(course, on_delete=models.PROTECT)
    semester      = models.ForeignKey(Semester, on_delete=models.PROTECT)
    academic_year = models.ForeignKey(AcademicYear, on_delete=models.PROTECT)
    total_fees    = models.DecimalField(max_digits=12, decimal_places=2)

    def __str__(self):
        return f"{self.course} - {self.semester} - {self.academic_year}"


class FeePayment(models.Model):
    METHOD_CHOICES = [
        ('mpesa', 'Mpesa'), ('bank', 'Bank Transfer'), ('cash', 'Cash')
    ]

    student         = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    academic_year   = models.ForeignKey(AcademicYear, on_delete=models.PROTECT)
    semester        = models.ForeignKey(Semester, on_delete=models.PROTECT)
    amount_paid     = models.DecimalField(max_digits=12, decimal_places=2)
    payment_method  = models.CharField(max_length=20, choices=METHOD_CHOICES)
    transaction_ref = models.CharField(max_length=100, unique=True)
    payment_date    = models.DateTimeField()
    verified        = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.student} - {self.amount_paid} - {self.transaction_ref}"


# ─── CLEARANCE ───────────────────────────────────────────────────────────────

class ClearanceRecord(models.Model):
    DEPT_CHOICES = [
        ('finance',  'Finance'),
        ('library',  'Library'),
        ('hostel',   'Hostel'),
        ('academic', 'Academic Office'),
    ]

    student    = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    semester   = models.ForeignKey(Semester, on_delete=models.PROTECT)
    department = models.CharField(max_length=20, choices=DEPT_CHOICES)
    cleared    = models.BooleanField(default=False)
    cleared_at = models.DateTimeField(null=True, blank=True)
    remarks    = models.TextField(blank=True)

    class Meta:
        unique_together = ['student', 'semester', 'department']

    def __str__(self):
        return f"{self.student} - {self.department} - {'Cleared' if self.cleared else 'Pending'}"


# ─── HOSTEL ──────────────────────────────────────────────────────────────────

class Hostel(models.Model):
    GENDER_CHOICES = [('male', 'Male'), ('female', 'Female')]

    name     = models.CharField(max_length=100)
    gender   = models.CharField(max_length=10, choices=GENDER_CHOICES)
    capacity = models.PositiveIntegerField()

    def __str__(self):
        return self.name


class Room(models.Model):
    hostel       = models.ForeignKey(Hostel, on_delete=models.CASCADE)
    number       = models.CharField(max_length=20)
    capacity     = models.PositiveSmallIntegerField()
    is_available = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.hostel.name} - Room {self.number}"


class HostelBooking(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'), ('approved', 'Approved'), ('rejected', 'Rejected')
    ]

    student   = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    room      = models.ForeignKey(Room, on_delete=models.PROTECT)
    semester  = models.ForeignKey(Semester, on_delete=models.PROTECT)
    status    = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    booked_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.student} - {self.room} - {self.status}"


# ─── DISCIPLINARY ────────────────────────────────────────────────────────────

class DisciplinaryCase(models.Model):
    STATUS_CHOICES = [
        ('open', 'Open'), ('resolved', 'Resolved'), ('appealed', 'Appealed')
    ]

    student      = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    case_title   = models.CharField(max_length=200)
    description  = models.TextField()
    date         = models.DateField()
    status       = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    action_taken = models.TextField(blank=True)

    def __str__(self):
        return f"{self.student} - {self.case_title}"


# ─── ONLINE REPORTING ────────────────────────────────────────────────────────

class StudentReporting(models.Model):
    STATUS_CHOICES = [('reported', 'Reported'), ('absent', 'Absent')]

    student        = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    semester       = models.ForeignKey(Semester, on_delete=models.PROTECT)
    reporting_date = models.DateField()
    status         = models.CharField(max_length=20, choices=STATUS_CHOICES)

    class Meta:
        unique_together = ['student', 'semester']

    def __str__(self):
        return f"{self.student} - {self.semester} - {self.status}"


# ─── ATTACHMENTS ─────────────────────────────────────────────────────────────

class Attachment(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'), ('ongoing', 'Ongoing'), ('completed', 'Completed')
    ]

    student      = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    organization = models.CharField(max_length=200)
    supervisor   = models.CharField(max_length=200)
    start_date   = models.DateField()
    end_date     = models.DateField()
    logbook      = models.FileField(upload_to='logbooks/', null=True, blank=True)
    status       = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')

    def __str__(self):
        return f"{self.student} - {self.organization}"


# ─── STUDENT FORMS ───────────────────────────────────────────────────────────

class StudentForm(models.Model):
    FORM_TYPES = [
        ('deferral',   'Deferral'),
        ('transfer',   'Transfer'),
        ('transcript', 'Transcript Request'),
        ('bursary',    'Bursary Application'),
        ('other',      'Other'),
    ]
    STATUS_CHOICES = [
        ('pending', 'Pending'), ('approved', 'Approved'), ('rejected', 'Rejected')
    ]

    student         = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    form_type       = models.CharField(max_length=30, choices=FORM_TYPES)
    document        = models.FileField(upload_to='student_forms/', null=True, blank=True)
    submission_date = models.DateField(auto_now_add=True)
    status          = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    remarks         = models.TextField(blank=True)

    def __str__(self):
        return f"{self.student} - {self.form_type} - {self.status}"


# ─── LOST CARD ───────────────────────────────────────────────────────────────

class LostCardReport(models.Model):
    STATUS_CHOICES = [
        ('pending',    'Pending'),
        ('processing', 'Processing'),
        ('replaced',   'Replaced'),
    ]

    student            = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    report_date        = models.DateField(auto_now_add=True)
    description        = models.TextField()
    replacement_status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')

    def __str__(self):
        return f"{self.student} - {self.report_date} - {self.replacement_status}"