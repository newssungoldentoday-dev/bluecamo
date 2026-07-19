; Assembly - Fast hash for image IDs
section.text
global fast_hash
fast_hash:
    xor rax, rax
    mov rcx, 5381
.loop:
    movzx rdx, byte [rdi]
    test rdx, rdx
    jz.done
    imul rcx, 33
    add rcx, rdx
    inc rdi
    jmp.loop
.done:
    mov rax, rcx
    ret
