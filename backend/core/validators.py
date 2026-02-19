import magic
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _

def validate_file_security(file):
    """
    Validates file size and actual MIME type using magic numbers.
    """
    # 1. Check file size (limit to 10MB)
    filesize = file.size
    if filesize > 10 * 1024 * 1024:
        raise ValidationError(_("Filen er for stor. Maksimal størrelse er 10MB."))

    # 2. Check MIME type using python-magic
    # We read the header of the file to determine the true type
    initial_pos = file.tell()
    file.seek(0)
    file_content = file.read(2048)
    file.seek(initial_pos)

    mime = magic.from_buffer(file_content, mime=True)

    allowed_types = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', # .docx
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',    # .xlsx
        'image/png',
        'image/jpeg',
    ]

    if mime not in allowed_types:
        raise ValidationError(
            _("Ugyldig filtype (registreret som %(mime)s). Kun PDF, Word, Excel og billeder (PNG/JPG) er tilladt."),
            params={'mime': mime},
        )
