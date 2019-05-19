package com.pad.cristina.freely.view;

import android.content.Intent;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import com.pad.cristina.freely.R;
import com.pad.cristina.freely.util.ValidityUtils;

public class LoginActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);
        final Button btnLogin = findViewById(R.id.buttonLogin);
        final EditText emailEditTxt = findViewById(R.id.email);

        check_login_validity(btnLogin, emailEditTxt);
    }

    private void check_login_validity(Button btnRegister, final EditText emailEditTxt) {
        btnRegister.setOnClickListener(new View.OnClickListener() {
            public void onClick(View view) {
                String txt = emailEditTxt.getText().toString();
               /* if(!ValidityUtils.isEmailValid(txt))
                    Toast.makeText(LoginActivity.this,"Email-ul "+txt+" este gresit",Toast.LENGTH_SHORT).show();
                else{*/
                    Intent intent = new Intent(LoginActivity.this, DashboardActivity.class);
                    startActivity(intent);
                //}
            }
        });
    }

    public void register_action(View view)
    {
        Intent intent = new Intent(LoginActivity.this, RegisterActivity.class);
        startActivity(intent);
    }
}

