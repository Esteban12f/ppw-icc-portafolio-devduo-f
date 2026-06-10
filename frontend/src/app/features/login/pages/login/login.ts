import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../../../shared/components/button-component/button-component';
import { CardComponent } from '../../../../shared/components/card-component/card-component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, CardComponent, ButtonComponent],
  templateUrl: './login.html'
})
export class Login {
  private auth   = inject(Auth);
  private router = inject(Router);

  activeTab: 'login' | 'register' = 'login';
  isSubmitting = false;

  // Datos de Login
  loginData = { email: '', password: '' };
  emailError: string | null = null;
  passError:  string | null = null;

  // Datos de Registro
  regData = { email: '', password: '', confirmPassword: '' };
  authError: string | null = null;

  switchTab(tab: 'login' | 'register'): void {
    this.activeTab = tab;
    this.emailError = null;
    this.passError  = null;
    this.authError  = null;
  }

  /**
   * Despachador: según la pestaña activa, hace login o registro.
   */
  async handleAuth(): Promise<void> {
    if (this.activeTab === 'login') {
      await this.handleLogin();
    } else {
      await this.handleRegister();
    }
  }

  private async handleLogin(): Promise<void> {
    this.emailError = null;
    this.passError  = null;
    this.isSubmitting = true;
    try {
      await signInWithEmailAndPassword(this.auth, this.loginData.email, this.loginData.password);
      this.router.navigate(['/requests']);
    } catch (error: any) {
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
        this.passError = 'Correo o contraseña incorrectos.';
      } else if (error.code === 'auth/invalid-email') {
        this.emailError = 'El formato del correo es inválido.';
      } else if (error.code === 'auth/too-many-requests') {
        this.passError = 'Demasiados intentos. Intenta más tarde.';
      } else {
        this.passError = 'Error al iniciar sesión.';
      }
    } finally {
      this.isSubmitting = false;
    }
  }

  private async handleRegister(): Promise<void> {
    this.authError = null;
    if (this.regData.password !== this.regData.confirmPassword) {
      this.authError = 'Las contraseñas no coinciden.';
      return;
    }
    this.isSubmitting = true;
    try {
      await createUserWithEmailAndPassword(this.auth, this.regData.email, this.regData.password);
      this.router.navigate(['/requests']);
    } catch (error: any) {
      switch (error.code) {
        case 'auth/email-already-in-use':
          this.authError = 'Este correo ya está registrado. Intenta iniciar sesión.';
          break;
        case 'auth/weak-password':
          this.authError = 'La contraseña es muy débil. Usa al menos 6 caracteres.';
          break;
        case 'auth/invalid-email':
          this.authError = 'El formato del correo es inválido.';
          break;
        default:
          this.authError = 'Error al crear la cuenta. Intenta de nuevo.';
      }
    } finally {
      this.isSubmitting = false;
    }
  }

  async loginWithGoogle(): Promise<void> {
    this.authError = null;
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(this.auth, provider);
      this.router.navigate(['/requests']);
    } catch (error: any) {
      if (error.code !== 'auth/popup-closed-by-user') {
        this.authError = 'Error al iniciar sesión con Google.';
      }
    }
  }
}