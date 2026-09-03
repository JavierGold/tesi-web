# Infraestructura de TESI

Terraform administra el hosting existente y la infraestructura serverless del formulario de Empleo.

## Flujo de Empleo

1. El frontend solicita a `POST /employment/upload` autorización para cargar un PDF.
2. Lambda devuelve un POST prefirmado limitado a una clave aleatoria, MIME PDF, cifrado y tamaño máximo.
3. El navegador carga directamente el CV al bucket privado de S3.
4. El frontend envía los campos y la referencia opaca a `POST /employment/submit`.
5. Lambda valida nuevamente campos, disponibilidad, clave, token, tamaño, MIME y firma interna del PDF.
6. Lambda bloquea envíos repetidos, genera un enlace S3 temporal y envía mediante SES un correo HTML con el CV adjunto.

Los CV y bloqueos se eliminan automáticamente después de 30 días. El bucket bloquea todo acceso público y exige TLS. API Gateway y S3 admiten únicamente los orígenes exactos definidos en Terraform.

## Configuración

- `employment_recipient_email`: destinatario fijo de las solicitudes.
- `employment_sender_email`: identidad remitente de SES.
- `employment_additional_allowed_origins`: orígenes adicionales exactos, por ejemplo un dominio propio futuro.

El output `employment_api_url` proporciona el valor que debe compilarse como `VITE_EMPLOYMENT_API_URL`. La Access Key de Web3Forms sigue utilizándose exclusivamente por Contacto.

## Despliegue

Ejecutar `terraform fmt`, `terraform validate` y revisar `terraform plan` antes de aplicar. `terraform apply` requiere autorización explícita. Después del primer apply, el propietario de `employment_sender_email` debe confirmar el correo automático de verificación de SES antes de poder enviar solicitudes reales.
